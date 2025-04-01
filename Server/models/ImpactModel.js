const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Impact = sequelize.define(
  "Impact",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    title_lo: {
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
    helped: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    caption_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    caption_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX || ""}impacts`,
    timestamps: true,
  }
);

module.exports = Impact; 