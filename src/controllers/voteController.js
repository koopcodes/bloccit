// Load dependencies
const voteQueries = require('../db/queries.votes.js');

module.exports = {
	upvote(req, res, next) {
		// upvote checks if there is a user signed in and if so, calls the createVote method passing the request as well as 1 to indicate it is an upvote. If an error returns from the method, we load a flash message. Otherwise, we redirect to the referring page.
		if (req.user) {
			voteQueries.createVote(req, 1, (err, vote) => {
				if (err) {
					req.flash('error', err);
				}
				res.redirect(req.headers.referer);
			});

			// If the user isn't signed in, we flash a message and redirect.
		} else {
			req.flash('notice', 'You must be signed in to do that.');
			res.redirect(req.headers.referer);
		}
	},
	downvote(req, res, next) {
		if (req.user) {
			voteQueries.createVote(req, -1, (err, vote) => {
				if (err) {
					req.flash('error', err);
				}
				res.redirect(req.headers.referer);
			});
		} else {
			req.flash('notice', 'You must be signed in to do that.');
			res.redirect(req.headers.referer);
		}
	},
};
