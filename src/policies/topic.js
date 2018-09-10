// #1 We require ApplicationPolicy so that we can extend it. Recall that when class A extends class B, class A inherits all the methods and attributes that class B has.
const ApplicationPolicy = require('./application');

module.exports = class TopicPolicy extends ApplicationPolicy {
	// #2 We provide our definition of the new method because using the one defined in the interface of the parent would not work for this resource. We only want admin users to create new topics. The create method delegates to the new method.
	new() {
		return this._isAdmin();
	}

	create() {
		return this.new();
	}

	// #3  Only admins can edit topics, so the edit method checks that the user is an admin user
	edit() {
		return this._isAdmin();
	}

	update() {
		return this.edit();
	}

	destroy() {
		return this.update();
	}
};
