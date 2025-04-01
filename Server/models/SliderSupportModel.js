const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const SliderSupport = sequelize.define(
  'SliderSupport',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title_lo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description_lo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX}sliders_support`,
    timestamps: true,
  }
);

module.exports = SliderSupport; 