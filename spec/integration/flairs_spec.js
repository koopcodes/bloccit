const request = require('request');
const server = require('../../src/server');
const base = 'http://localhost:3000/topics';
const sequelize = require('../../src/db/models/index').sequelize;

const Topic = require('../../src/db/models').Topic;
const Post = require('../../src/db/models').Post;
const Flair = require('../../src/db/models').Flair;

describe('routes : flair', () => {
	beforeEach(done => {
		this.topic;
		this.post;
		this.flair;

		sequelize.sync({ force: true }).then(res => {
			Topic.create({
				title: 'Fav Lord of the Rings Character',
				description: 'Who would not want to be an elf?',
			}).then(topic => {
				this.topic = topic;

				Post.create({
					title: 'Elrond Kicks Ass',
					body: 'Does Half-Elvan count?',
					topicId: this.topic.id,
				}).then(post => {
					this.post = post;

					Flair.create({
						name: 'Gold flair',
						color: 'gold',
						topicId: this.topic.id,
						postId: this.post.id,
					})
						.then(flair => {
							this.flair = flair;
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

	describe('GET /posts/:postId/flair/new', () => {
		it('should render a new flair form', done => {
			request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/new`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain('New Flair');
				done();
			});
		});
	});

	describe('POST /posts/:postId/flair/create', () => {
		it('should create a new flair and redirect', done => {
			const options = {
				url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/create`,
				form: {
					name: 'New Flair',
					color: 'magenta',
				},
			};
			request.post(options, (err, res, body) => {
				Flair.findOne({ where: { name: 'New Flair' } })
					.then(flair => {
						expect(flair).not.toBeNull();
						expect(flair.name).toContain('New Flair');
						expect(flair.color).toContain('magenta');
						expect(flair.postId).not.toBeNull();
						expect(flair.topicId).not.toBeNull();
						done();
					})
					.catch(err => {
						console.log(err);
						done();
					});
			});
		});
	});

	describe('GET /posts/:postId/flair/:id', () => {
		it('should render a view with the selected flair', done => {
			request.get(`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain('Gold flair');
				done();
			});
		});
	});

	describe('POST /posts/:postId/flair/:id/destroy', () => {
		it('should delete the flair with the associated id', done => {
			expect(this.flair.id).toBe(1);

			request.post(
				`${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/destroy`,
				(err, res, body) => {
					Flair.findById(1).then(flair => {
						expect(err).toBeNull();
						expect(flair).toBeNull();
						done();
					});
				},
			);
		});
	});

	describe('GET /posts/:postId/flair/:id/edit', () => {
		it('should render a veiw with an edit post form', done => {
			request.get(`${base}/${this.topic.id}/posts/${this.postId}/flairs/${this.flair.id}/edit`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain('Edit Flair');
				expect(body).toContain('Gold flair');
				done();
			});
		});
	});

	describe('POST /posts/:postId/flair/:id/update', () => {
		it('should return a status code 302', done => {
			request.post(
				{
					url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/update`,
					form: {
						name: 'Update flair',
						color: 'red',
					},
				},
				(err, res, body) => {
					expect(res.statusCode).toBe(302);
					done();
				},
			);
		});

		it('should update the flair with the given values', done => {
			const options = {
				url: `${base}/${this.topic.id}/posts/${this.post.id}/flairs/${this.flair.id}/update`,
				form: {
					name: 'Update this flair',
				},
			};
			request.post(options, (err, res, body) => {
				expect(err).toBeNull();
				Flair.findOne({
					where: { id: this.flair.id },
				}).then(flair => {
					expect(flair.name).toBe('Update this flair');
					done();
				});
			});
		});
	});
});
