const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const TouristAttractionCategory = require('./touristAttractionCategoryModel');

const TouristAttraction = sequelize.define(
  'TouristAttraction',
  {
    attraction_id: {
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
    Duration_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Duration_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    GroupSize_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    GroupSize_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    language_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    language_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Available_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Available_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ExpectOne_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ExpectOne_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ExpectTwo_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ExpectTwo_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ExpectThree_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ExpectThree_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TouristAttractionCategory,
        key: 'id'
      }
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    images: {
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
    tableName: `${process.env.TB_PREFIX}tourist_attractions`,
    timestamps: true,
  }
);

TouristAttraction.belongsTo(TouristAttractionCategory, {
  foreignKey: 'category_id',
  as: 'category'
});

module.exports = TouristAttraction; 