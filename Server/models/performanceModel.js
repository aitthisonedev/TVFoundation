const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Performance = sequelize.define(
  "Performance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    headImg: {
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX}performance`,
    timestamps: false,
  }
);

module.exports = Performance; 