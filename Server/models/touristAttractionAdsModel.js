const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const TouristAttractionAds = sequelize.define(
  'TouristAttractionAds',
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
    tableName: `${process.env.TB_PREFIX}tourist_attraction_ads`,
    timestamps: true,
  }
);

module.exports = TouristAttractionAds; 