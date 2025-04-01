const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const CoreValues = sequelize.define(
  "CoreValues",
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
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX || ""}core_values`,
    timestamps: true,
  }
);

module.exports = CoreValues;