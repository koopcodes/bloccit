const Post = require('./models').Post;
const Topic = require('./models').Topic;
const Authorizer = require('../policies/post');
// We add the comment and user models so we can refer to them in the getPost method.
const Comment = require('./models').Comment;
const User = require('./models').User;

module.exports = {
	addPost(newPost, callback) {
		return Post.create(newPost)
			.then(post => {
				callback(null, post);
			})
			.catch(err => {
				callback(err);
			});
	},

	// We edit getPost to pass an options object that Sequelize uses when building the query. By passing the include property, we are telling it to include all objects in the table associated with the model Comment and set them as a value to the property  comments. The nested include tells Sequelize that for each comment, also include the associated User.
	getPost(id, callback) {
		return Post.findById(id, {
			include: [
				{
					model: Comment,
					as: 'comments',
					include: [{ model: User }],
				},
			],
		})
			.then(post => {
				callback(null, post);
			})
			.catch(err => {
				callback(err);
			});
	},

	deletePost(req, callback) {
		return Post.findById(req.params.id)
			.then(post => {
				const authorized = new Authorizer(req.user, post).destroy();
				if (authorized) {
					post.destroy().then(res => {
						callback(null, post);
					});
				} else {
					req.flash('notice', 'You are not authorized to do that.');
					callback(401);
				}
			})
			.catch(err => {
				callback(err);
			});
	},

	updatePost(req, updatedPost, callback) {
		return Post.findById(req.params.id).then(post => {
			if (!post) {
				return callback('Post not found');
			}
			const authorized = new Authorizer(req.user, post).update();
			if (authorized) {
				post
					.update(updatedPost, {
						fields: Object.keys(updatedPost),
					})
					.then(() => {
						callback(null, post);
					})
					.catch(err => {
						callback(err);
					});
			} else {
				req.flash('notice', 'You are not authorized to do that.');
				callback('Forbidden');
			}
		});
	},
};
