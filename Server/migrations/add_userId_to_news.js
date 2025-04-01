'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      `${process.env.TB_PREFIX}news`,
      'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: `${process.env.TB_PREFIX}users`,
          key: 'id'
        },
        after: 'news_id'
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      `${process.env.TB_PREFIX}news`,
      'userId'
    );
  }
}; 