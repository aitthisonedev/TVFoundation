const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const ProductCategory = require('./productCategoryModel');

const Product = sequelize.define(
  'Product',
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    originalPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    shippingFee: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
    },
    available: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductCategory,
        key: 'id'
      }
    },
    coverImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    subImages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX}products`,
    timestamps: true,
  }
);

Product.belongsTo(ProductCategory, {
  foreignKey: 'category_id',
  as: 'category'
});

module.exports = Product; 