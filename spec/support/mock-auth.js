module.exports = {
	// #1 fakeIt takes the Express instance when called and mounts the middleware and the route needed for our fake authorization endpoint.
	fakeIt(app) {
		// #2  We allocate variables outside of the middleware function so we can keep them defined after the middleware function has passed control to the next function.
		let role, id, email;

		// #3 We define the middleware function we will use.
		function middleware(req, res, next) {
			// #4 We evaluate the properties expected to come in from req.body to see if they have contents. The first time, they will contain the values passed in the body of the request, and they will be stored in the outer scope of the function. This will ensure that we have access to the passed in values.
			role = req.body.role || role;
			id = req.body.userId || id;
			email = req.body.email || email;

			// #5 Passport loads the authenticated user in req.user and we will do the same if id has a value. We will use the /auth/fake endpoint to mock either sign in or sign out of a user. To mock signing out, we will pass 0 in the form as a userId value in our tests. IDs are issued starting with 1, so we can be certain that 0 will never be associated with a real user.
			if (id && id != 0) {
				req.user = {
					'id': id,
					'email': email,
					'role': role,
				};
			} else if (id == 0) {
				delete req.user;
			}

			if (next) {
				next();
			}
		}

		// #6 We define the route.
		function route(req, res) {
			res.redirect('/');
		}

		// #7 We mount the middleware route
		app.use(middleware);
		app.get('/auth/fake', route);
	},
};
