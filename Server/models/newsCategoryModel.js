const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const NewsCategory = sequelize.define(
  'NewsCategory',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX}news_categories`,
    timestamps: true,
  }
);

module.exports = NewsCategory; 