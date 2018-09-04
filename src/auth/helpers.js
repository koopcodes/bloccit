const bcrypt = require('bcryptjs');

module.exports = {
	// #1 ensureAuthenticated can be passed as a middleware function placed before protected requests that require authentication. When Passport successfully authenticates a user, it places the user in req.user. Our method checks that property to determine if the user should be redirected to the sign in page (if not authenticated) or allow the next function to execute by calling next.
	ensureAuthenticated(req, res, next) {
		if (!req.user) {
			req.flash('notice', 'You must be signed in to do that.');
			return res.redirect('/users/sign_in');
		} else {
			next();
		}
	},

	// #2 We call comparePass with the plain-text password sent in the request and the hashed password retrieved by the strategy. It passes both to a bcrypt function that decrypts the hashed password and compares it with the plain-text version. It returns  true if the comparison was a match and false otherwise.
	comparePass(userPassword, databasePassword) {
		return bcrypt.compareSync(userPassword, databasePassword);
	},
};
