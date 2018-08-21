module.exports = {
	index(req, res, next) {
		res.render('static/index', { title: 'Welcome to Bloccit' });
	},

	marco(req, res, next) {
		res.render('static/marco', { body: 'polo' });
	},

	about(req, res, next) {
		res.render('static/partials/about', { h1: 'About Us' });
	},
};
