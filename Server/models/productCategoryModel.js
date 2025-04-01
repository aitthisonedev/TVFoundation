const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const ProductCategory = sequelize.define(
  'ProductCategory',
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
    tableName: `${process.env.TB_PREFIX}product_categories`,
    timestamps: true,
  }
);

module.exports = ProductCategory; 