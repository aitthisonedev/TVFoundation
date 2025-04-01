const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const NewsCategories = sequelize.define(
  'NewsCategories',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    Categories_en: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'English category name cannot be empty'
        },
        len: {
          args: [2, 100],
          msg: 'Category name must be between 2 and 100 characters'
        }
      }
    },
    Categories_lo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Lao category name cannot be empty'
        },
        len: {
          args: [2, 100],
          msg: 'Category name must be between 2 and 100 characters'
        }
      }
    }
  },
  {
    tableName: `${process.env.TB_PREFIX}news_categories`,
    timestamps: false
  }
);

module.exports = NewsCategories; 