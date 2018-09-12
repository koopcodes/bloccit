const ApplicationPolicy = require('./application');

module.exports = class AdvertisementPolicy extends ApplicationPolicy {
	// #2
	new() {
		return this._isMember() || this._isAdmin();
	}

	create() {
		return this.new();
	}

	// #3
	edit() {
		return this._isAdmin() || this._isOwner();
	}

	update() {
		return this.edit();
	}

	destroy() {
		return this.update();
	}
};
