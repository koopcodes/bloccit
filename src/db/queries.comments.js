// #1 We import the necessary modules.
const Comment = require('./models').Comment;
const Post = require('./models').Post;
const User = require('./models').User;

const Authorizer = require('../policies/comment.js');

module.exports = {
	// #2 We define createComment to take an object and callback. We call create on  Comment and pass the object in to create the comment requested.
	createComment(newComment, callback) {
		return Comment.create(newComment)
			.then(comment => {
				callback(null, comment);
			})
			.catch(err => {
				callback(err);
			});
	},

	// #3 We define deleteComment to take the request object along with a callback. We query the comments table for the right comment and pass it and the user to the policy instance. If the policy returns as authorized, we call destroy on the comment. If not, we load a flash error and pass an error to the callback.
	deleteComment(req, callback) {
		return Comment.findById(req.params.id).then(comment => {
			const authorized = new Authorizer(req.user, comment).destroy();
			if (authorized) {
				comment.destroy();
				console.log('Destroy Comment Loop in queries.comments.js entered');
				callback(null, comment);
			} else {
				req.flash('notice', 'You are not authorized to do that.');
				callback(401);
			}
		});
	},
};
