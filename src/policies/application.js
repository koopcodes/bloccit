module.exports = class ApplicationPolicy {
	// #1 The constructor initializes the policy instance with the currently authenticated user and objects we are trying to authorize
	constructor(user, record) {
		this.user = user;
		this.record = record;
	}

	_isOwner() {
		return this.record && this.user && this.record.userId == this.user.id;
	}

	_isAdmin() {
		return this.user && this.user.role == 'admin';
	}

	_isMember() {
		return this.user && this.user.role == 'member';
	}

	// #3 new checks that a user is present. create delegates to new. show always authorizes the action.
	new() {
		return this.user != null;
	}

	create() {
		return this.new();
	}

	show() {
		return true;
	}

	// #4 edit checks that the user is allowed to create a new record, a record is present, and either the user owns the record, or the user is an admin.
	edit() {
		return this.new() && this.record && (this._isOwner() || this._isAdmin());
	}

	update() {
		return this.edit();
	}

	// #5 destroy delegates to update
	destroy() {
		return this.update();
	}
};
