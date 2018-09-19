// We load the dependencies needed.
const Comment = require('./models').Comment;
const Post = require('./models').Post;
const User = require('./models').User;
const Vote = require('./models').Vote;

module.exports = {
	createVote(req, val, callback) {
		// We call findOne on the Vote model to look for a Vote object with the id of the current user as well as the id of the post being voted on
		return Vote.findOne({
			where: {
				postId: req.params.postId,
				userId: req.user.id,
			},
		}).then(vote => {
			// If we find a vote, that means the user has already voted on it. We update the vote's value to the new upvote or downvote value and save the change.
			if (vote) {
				vote.value = val;
				vote
					.save()
					.then(vote => {
						callback(null, vote);
					})
					.catch(err => {
						callback(err);
					});
			} else {
				// If we don't find a vote, we create a new vote with the information provided
				Vote.create({
					value: val,
					postId: req.params.postId,
					userId: req.user.id,
				})
					.then(vote => {
						callback(null, vote);
					})
					.catch(err => {
						callback(err);
					});
			}
		});
	},
};
