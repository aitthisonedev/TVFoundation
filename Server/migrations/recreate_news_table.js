'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop existing table if it exists
    await queryInterface.dropTable(`${process.env.TB_PREFIX}news`, { force: true });

    // Create table with correct references
    await queryInterface.createTable(`${process.env.TB_PREFIX}news`, {
      news_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name_en: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      name_lo: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      description_lo: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content_en: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content_lo: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      location_en: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      location_lo: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      caption_en: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      caption_lo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tags_en: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tags_lo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: `${process.env.TB_PREFIX}news_categories`,
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: `${process.env.TB_PREFIX}users`,
          key: 'id'
        }
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(`${process.env.TB_PREFIX}news`);
  }
}; 