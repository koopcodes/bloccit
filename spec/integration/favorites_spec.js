// Load the required dependencies for our tests.
const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/topics/';

const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const User = require('../../src/db/models').User;
const Favorite = require('../../src/db/models').Favorite;

describe('routes : favorites', () => {
	beforeEach(done => {
		// Define variables to use in the tests.
		this.user;
		this.topic;
		this.post;

		// Clear the database and create the objects for our tests.
		sequelize.sync({ force: true }).then(res => {
			User.create({
				email: 'starman@tesla.com',
				password: 'Trekkie4lyfe',
			}).then(res => {
				this.user = res;

				Topic.create(
					{
						title: 'Expeditions to Alpha Centauri',
						description: 'A compilation of reports from recent visits to the star system.',
						posts: [
							{
								title: 'My first visit to Proxima Centauri b',
								body: 'I saw some rocks.',
								userId: this.user.id,
							},
						],
					},
					{
						include: {
							model: Post,
							as: 'posts',
						},
					},
				)
					.then(res => {
						this.topic = res;
						this.post = this.topic.posts[0];
						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});
		});
	});

	// BEGIN Guest User Test Context

	// Define a suite to describe a guest user attempting to favorite a post
	describe('guest attempting to favorite on a post', () => {
		beforeEach(done => {
			request.get(
				{
					url: 'http://localhost:3000/auth/fake',
					form: {
						userId: 0,
					},
				},
				(err, res, body) => {
					done();
				},
			);
		});

		describe('POST /topics/:topicId/posts/:postId/favorites/create', () => {
			it('should not create a new favorite', done => {
				const options = {
					url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/create`,
				};

				let favCountBeforeCreate;
				// We take note of the number of favorites that exist for the post before sending the delete request. We then check that the number of favorites has not changed to confirm no favorite was deleted.
				this.post.getFavorites().then(favorites => {
					favCountBeforeCreate = favorites.length;
					request.post(options, (err, res, body) => {
						Favorite.all()
							.then(favorite => {
								// confirm no favorites created
								expect(favCountBeforeCreate).toBe(favorite.length);
								done();
							})
							.catch(err => {
								console.log(err);
								done();
							});
					});
				});
			});
		});
	});
	// END Guest User Test Context

	// BEGIN Member Test Context

	describe('signed in user favoriting a post', () => {
		beforeEach(done => {
			request.get(
				{
					url: 'http://localhost:3000/auth/fake',
					form: {
						// mock authenticate as member user
						role: 'member',
						userId: this.user.id,
					},
				},
				(err, res, body) => {
					done();
				},
			);
		});

		describe('POST /topics/:topicId/posts/:postId/favorites/create', () => {
			it('should create a favorite', done => {
				const options = {
					url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/create`,
				};

				request.post(options, (err, res, body) => {
					Favorite.findOne({
						where: {
							userId: this.user.id,
							postId: this.post.id,
						},
					})
						.then(favorite => {
							// confirm that a favorite was created
							expect(favorite).not.toBeNull();
							expect(favorite.userId).toBe(this.user.id);
							expect(favorite.postId).toBe(this.post.id);
							done();
						})
						.catch(err => {
							console.log(err);
							done();
						});
				});
			});
		});

		describe('POST /topics/:topicId/posts/:postId/favorites/:id/destroy', () => {
			it('should destroy a favorite', done => {
				const options = {
					url: `${base}${this.topic.id}/posts/${this.post.id}/favorites/create`,
				};

				let favCountBeforeDelete;

				request.post(options, (err, res, body) => {
					this.post.getFavorites().then(favorites => {
						const favorite = favorites[0];
						favCountBeforeDelete = favorites.length;

						request.post(
							`${base}${this.topic.id}/posts/${this.post.id}/favorites/${favorite.id}/destroy`,
							(err, res, body) => {
								this.post.getFavorites().then(favorites => {
									expect(favorites.length).toBe(favCountBeforeDelete -1);
									done();
								});
							},
						);
					});
				});
			});
		});
	});
	// END Member Test Context
});
