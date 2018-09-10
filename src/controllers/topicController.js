const topicQueries = require('../db/queries.topics.js');
// #1 We require the TopicPolicy and store it in Authorizer.
const Authorizer = require('../policies/topic');

module.exports = {
	index(req, res, next) {
		topicQueries.getAllTopics((err, topics) => {
			if (err) {
				res.redirect(500, 'static/index');
			} else {
				res.render('topics/index', { topics });
			}
		});
	},

	new(req, res, next) {
		// #2 Inside the new action, we have access to the request object while Passport has a reference to the signed in user in req.user. We create an instance of our policy class, pass the signed in user and call the new method of the policy class. We store the result in the authorized variable which is set to true if the user is authorized to create a new topic and false otherwise. Based on this, we either render the new topic form or flash a notice and redirect to the topic index view.
		const authorized = new Authorizer(req.user).new();

		if (authorized) {
			res.render('topics/new');
		} else {
			req.flash('notice', 'You are not authorized to do that.');
			res.redirect('/topics');
		}
	},

	create(req, res, next) {
		// #1 We pass the user to the policy constructor and call create on the policy instance
		const authorized = new Authorizer(req.user).create();

		// #2 If authorized evaluates to true, we continue with Topic object creation
		if (authorized) {
			let newTopic = {
				title: req.body.title,
				description: req.body.description,
			};
			topicQueries.addTopic(newTopic, (err, topic) => {
				if (err) {
					res.redirect(500, 'topics/new');
				} else {
					res.redirect(303, `/topics/${topic.id}`);
				}
			});
		} else {
			// #3 If the user is not authorized, we flash an error and redirect
			req.flash('notice', 'You are not authorized to do that.');
			res.redirect('/topics');
		}
	},

	show(req, res, next) {
		topicQueries.getTopic(req.params.id, (err, topic) => {
			if (err || topic == null) {
				res.redirect(404, '/');
			} else {
				res.render('topics/show', { topic });
			}
		});
	},

	destroy(req, res, next) {
		// #1 We pass the request object to the deleteTopic method.
		topicQueries.deleteTopic(req, (err, topic) => {
			if (err) {
				res.redirect(err, `/topics/${req.params.id}`);
			} else {
				res.redirect(303, '/topics');
			}
		});
	},

	edit(req, res, next) {
		// #1 We query for the topic with the matching ID from the URL parameters
		topicQueries.getTopic(req.params.id, (err, topic) => {
			if (err || topic == null) {
				res.redirect(404, '/');
			} else {
				// #2 If we find the topic we pass it to the policy constructor along with the signed in user. Then we call the edit method of the policy class to determine if the user is authorized.
				const authorized = new Authorizer(req.user, topic).edit();

				// #3 If the user is authorized, we render the edit view. If not, we flash an error and redirect
				if (authorized) {
					res.render('topics/edit', { topic });
				} else {
					req.flash('You are not authorized to do that.');
					res.redirect(`/topics/${req.params.id}`);
				}
			}
		});
	},

	update(req, res, next) {
		// #1 The updateTopic method will now take the request and the request's body as the first two arguments. req.body will contain key/value pairs passed on the form that is being submitted to this action. Let's move to queries.topics.js again to refactor the method:
		topicQueries.updateTopic(req, req.body, (err, topic) => {
			if (err || topic == null) {
				res.redirect(401, `/topics/${req.params.id}/edit`);
			} else {
				res.redirect(`/topics/${req.params.id}`);
			}
		});
	},
};
