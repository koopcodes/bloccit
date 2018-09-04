module.exports = {
	validatePosts(req, res, next) {
		//#1 We check that the method used was POST and if so, use the methods provided by express-validator to check URL parameters and body of the request for the validations we need
		if (req.method === 'POST') {
			//#2 checkParams and checkBody can be called with two arguments. One is the parameter/property we are checking and the second is an error message to return if the validation fails. These methods return an object to which we can chain validation checkers like notEmpty and isLength. For title, we check that the length is at least two characters long
			req
				.checkParams('topicId', 'must be valid')
				.notEmpty()
				.isInt();
			req.checkBody('title', 'must be at least 2 characters in length').isLength({ min: 2 });
			req.checkBody('body', 'must be at least 10 characters in length').isLength({ min: 10 });
		}

		//#3 We gather any validation errors
		const errors = req.validationErrors();

		if (errors) {
			//#4 If we find errors we need to let the user know so they adjust their input. We will install the express-flash module this in the next section. It helps us load messages by using req.flash.
			req.flash('error', errors);
			return res.redirect(303, req.headers.referer);
		} else {
			return next();
		}
	},

	validateUsers(req, res, next) {
		if (req.method === 'POST') {
			// #1 In validateUsers, we call checkBody on the request object to confirm that email is a valid email address and password is at least six characters in length and that the  passwordConfirmation, if provided, matches password. If there are errors, we load the flash message and redirect to the referer. If there are no errors, we move to the next middleware function.
			req.checkBody('email', 'must be valid').isEmail();
			req.checkBody('password', 'must be at least 6 characters in length').isLength({ min: 6 });
			req
				.checkBody('passwordConfirmation', 'must match password provided')
				.optional()
				.matches(req.body.password);
		}

		const errors = req.validationErrors();

		if (errors) {
			req.flash('error', errors);
			return res.redirect(req.headers.referer);
		} else {
			return next();
		}
	},
};
