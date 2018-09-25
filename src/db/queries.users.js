// Require the User model and the bcrypt library
const User = require('./models').User;
const bcrypt = require('bcryptjs');
// Eager load Posts and Comments
const Post = require('./models').Post;
const Comment = require('./models').Comment;

module.exports = {
	// createUser takes an object with email, password, and passwordConfirmation properties, and a callback
	createUser(newUser, callback) {
		// Use bcrypt to generate a salt (data to pass to hashing function) and pass that to the hashSync hashing function with the password to hash
		const salt = bcrypt.genSaltSync();
		const hashedPassword = bcrypt.hashSync(newUser.password, salt);

		// #4 Store the hashed password in the database when we create the User object and return the user
		return User.create({
			email: newUser.email,
			password: hashedPassword,
		})
			.then(user => {
				callback(null, user);
			})
			.catch(err => {
				callback(err);
			});
	},

	getUser(id, callback) {
		// Define a result object to hold the user, posts, and comments that we will return and request the User object from the database
		let result = {};
		User.findById(id).then(user => {
			// If no user returns return an error
			if (!user) {
				callback(404);
			} else {
				// Otherwise, store the resulting user
				result['user'] = user;

				// Execute the scope on Post to get the last five posts made by the user
				Post.scope({ method: ['lastFiveFor', id] })
					.all()
					.then(posts => {
						result['posts'] = posts; // Store the result in the result object

						// Execute the scope on Comment to get the last five comments made by the user.
						Comment.scope({ method: ['lastFiveFor', id] })
							.all()
							.then(comments => {
								result['comments'] = comments; // Store the result in the object

								// Execute the scope on User to get tall favorites made by the user.
								User.scope({ method: ['allFavoritedPosts', id] })
									.all()
									.then(favorites => {
										let userFavorites = JSON.parse(JSON.stringify(favorites));
										let favoritePostsId = [];

										userFavorites[0].favorites.forEach(favorite => {
											favoritePostsId.push(favorite.postId);
										});

										var allFavorites = [];
										Post.findAll().then(allPosts => {
											allPosts.forEach(thisPost => {
												if (favoritePostsId.includes(thisPost.id)) {
													allFavorites.push({ id: thisPost.id, title: thisPost.title, topicId: thisPost.topicId });
												}
											});

											result['allFavorites'] = allFavorites; // Store the result in the object
											callback(null, result);								 // Pass Object using callback
										});
									});
							})
							.catch(err => {
								callback(err);
							});
					});
			}
		});
	},
	// END Get User
};
