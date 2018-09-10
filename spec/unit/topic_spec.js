const sequelize = require('../../src/db/models/index').sequelize;
const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
//#1 We require the User model to use it in our tests
const User = require('../../src/db/models').User;

describe('Post', () => {
	beforeEach(done => {
		this.topic;
		this.post;
		this.user;

		sequelize.sync({ force: true }).then(res => {
			// #2 We create a User object.
			User.create({
				email: 'starman@tesla.com',
				password: 'Trekkie4lyfe',
			}).then(user => {
				this.user = user; //store the user

				// #3 We create a Topic object
				Topic.create(
					{
						title: 'Expeditions to Alpha Centauri',
						description: 'A compilation of reports from recent visits to the star system.',

						// #4 We use nested create to create objects and associations in a single call. For each object in posts, Sequelize will create a Post object with the attribute values provided. The result will be a Topic object with associated Post objects
						posts: [
							{
								title: 'My first visit to Proxima Centauri b',
								body: 'I saw some rocks.',
								userId: this.user.id,
							},
						],
					},
					{
						// #5 The include property allows us to tell the method what model to use as well as where to store the resulting posts as in the Topic object.  [Topic instance name].posts will return an array of Post objects associated with the  Topic object
						include: {
							model: Post,
							as: 'posts',
						},
					},
				).then(topic => {
					this.topic = topic; //store the topic
					this.post = topic.posts[0]; //store the post
					done();
				});
			});
		});
	});

	describe('#create()', () => {
		it('should create a topic object with a title and description', done => {
			Topic.create({
				title: 'Orbital Insertion in Low Earth Orbit',
				description: 'To mathematically describe an orbit one must define six quantities',
			})
				.then(topic => {
					expect(topic.title).toBe('Orbital Insertion in Low Earth Orbit');
					expect(topic.description).toBe('To mathematically describe an orbit one must define six quantities');
					done();
				})
				.catch(err => {
					console.log(err);
					done();
				});
		});

		it('should not create a topic with missing title or description', done => {
			Topic.create({
				title: 'Orbital Insertion in Low Earth Orbit',
			})
				.then(post => {
					// the code in this block will not be evaluated since the validation error
					// will skip it. Instead, we'll catch the error in the catch block below
					// and set the expectations there
					done();
				})
				.catch(err => {
					expect(err.message).toContain('Topic.description cannot be null');
					done();
				});
		});
	});

	describe('#getPosts()', () => {
		it('should return an array of posts associated with the topic the method is called on', done => {
			this.topic.getPosts().then(associatedPosts => {
				expect(associatedPosts[0].title).toBe('My first visit to Proxima Centauri b');
				expect(associatedPosts[0].body).toBe('I saw some rocks.');
				expect(associatedPosts[0].topicId).toBe(this.topic.id);
				done();
			});
		});
	});
});
