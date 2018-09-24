'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('Users', 'role', {
			type: Sequelize.STRING,
			allowNull: false,

			// We use a new property called defaultValue to set a default value for the role property if not provided at creation
			defaultValue: 'member',
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('Users', 'role');
	},
};
