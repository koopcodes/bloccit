const Advertisement = require('./models').Advertisement;
const Authorizer = require('../policies/advertisement');

module.exports = {
	getAllAdvertisements(callback) {
		return Advertisement.all()
			.then(advertisements => {
				callback(null, advertisements);
			})
			.catch(err => {
				callback(err);
			});
	},
	addAdvertisement(newAdvertisement, callback) {
		return Advertisement.create(newAdvertisement)
			.then(advertisement => {
				callback(null, advertisement);
			})
			.catch(err => {
				callback(err);
			});
	},
	getAdvertisement(id, callback) {
		return Advertisement.findById(id)
			.then(advertisement => {
				callback(null, advertisement);
			})
			.catch(err => {
				callback(err);
			});
	},

	deleteAdvertisement(id, callback) {
		return Advertisement.destroy({
			where: { id },
		})
			.then(advertisement => {
				const authorized = new Authorizer(req.user, post).destroy();
				if (authorized) {
					advertisement.destroy().then(res => {
						callback(null, advertisement);
					});
				} else {
					req.flash('notice', 'You are not authorized to do that.');
					callback(401);
				}
			})
			.catch(err => {
				callback(err);
			});
	},

	updateAdvertisement(id, updatedAdvertisement, callback) {
		return Advertisement.findById(id).then(advertisement => {
			if (!advertisement) {
				return callback('Advertisement not found');
			}
			const authorized = new Authorizer(req.user, post).update();
			if (authorized) {
				advertisement
					.update(updatedAdvertisement, {
						fields: Object.keys(updatedAdvertisement),
					})
					.then(() => {
						callback(null, advertisement);
					})
					.catch(err => {
						callback(err);
					});
			} else {
				req.flash('notice', 'You are not authorized to do that.');
				callback('Forbidden');
			}
		});
	},
};
