const Topic = require('./models').Topic;
const Post = require('./models').Post;
const Flair = require('./models').Flair;

module.exports = {
	getAllTopics(callback) {
		return Topic.all()
			.then(topics => {
				callback(null, topics);
			})
			.catch(err => {
				callback(err);
			});
	},

	addTopic(newTopic, callback) {
		return Topic.create({
			title: newTopic.title,
			description: newTopic.description,
		})
			.then(topic => {
				callback(null, topic);
			})
			.catch(err => {
				callback(err);
			});
	},

	getTopic(id, callback) {
		return Topic.findById(id, {
			include: [
				{
					model: Post,
					as: 'posts',
				},
				{
					model: Flair,
					as: 'flairs',
				},
			],
		})
			.then(topic => {
				callback(null, topic);
			})
			.catch(err => {
				callback(err);
			});
	},

	deleteTopic(req, callback) {
		// #1 findById searches for a topic matching the ID in the request parameters
		return Topic.findById(req.params.id)
			.then(topic => {
				// #2 If we find the topic, we pass it, and the signed in user to the policy constructor and call the destroy method.
				const authorized = new Authorizer(req.user, topic).destroy();

				if (authorized) {
					// #3 If the user is authorized, we call the destroy method of the Sequelize model to destroy the record.
					topic.destroy().then(res => {
						callback(null, topic);
					});
				} else {
					// #4 If the user is not authorized, we load the flash message and pass a 401 through the callback for use in the redirect
					req.flash('notice', 'You are not authorized to do that.');
					callback(401);
				}
			})
			.catch(err => {
				callback(err);
			});
	},

	updateTopic(req, updatedTopic, callback) {
		// #1 We search for a topic matching the ID passed in the request parameters
		return Topic.findById(req.params.id).then(topic => {
			// #2 If not found, we return an error notice
			if (!topic) {
				return callback('Topic not found');
			}

			// #3 We authorize the user and topic by calling the update method of the policy instance.
			const authorized = new Authorizer(req.user, topic).update();

			if (authorized) {
				// #4 If the user is authorized, we call the update method of the Sequelize model. We pass in the object containing the keys matching the attributes and the values with which to update them
				topic
					.update(updatedTopic, {
						fields: Object.keys(updatedTopic),
					})
					.then(() => {
						callback(null, topic);
					})
					.catch(err => {
						callback(err);
					});
			} else {
				// #5 If the user is not authorized, we populate a notice and pass control back to the controller.
				req.flash('notice', 'You are not authorized to do that.');
				callback('Forbidden');
			}
		});
	},
};
