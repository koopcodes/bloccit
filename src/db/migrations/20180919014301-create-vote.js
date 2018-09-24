'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Votes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			// Validate that value is not null and set to either -1 or 1
			value: {
				type: Sequelize.INTEGER,
				allowNull: false,
				validate: {
					isIn: [[-1, 1]],
				},
			},
			// Set a postId attribute to associate a vote with a post. If we delete the associated post, we delete the votes associated with it as well
			postId: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Posts',
					key: 'id',
					as: 'postId',
				},
			},
			// Set a userId attribute to associate a vote with a user. If we delete the associated user, we delete the votes associated with it as well.
			userId: {
				type: Sequelize.INTEGER,
				onDelete: 'CASCADE',
				allowNull: false,
				references: {
					model: 'Users',
					key: 'id',
					as: 'userId',
				},
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
		return queryInterface.dropTable('Votes');
	},
};
