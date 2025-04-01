const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const ContentOne = sequelize.define(
  "ContentOne",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title_lo: {
      type: DataTypes.STRING,
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
    description_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX}content_one`,
    timestamps: false,
  }
);

module.exports = ContentOne; 