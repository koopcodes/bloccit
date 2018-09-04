'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			email: {
				allowNull: false,
				unique: true,
				// #1 We use the validate property which allows us to pass validators to apply to the data. The isEmail validator checks that the value passed to the email property is a valid email and if not, surfaces the msg provided in the validation error message
				validate: {
					isEmail: { msg: 'must be a valid email' },
				},
				type: Sequelize.STRING,
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('Users');
	},
};
