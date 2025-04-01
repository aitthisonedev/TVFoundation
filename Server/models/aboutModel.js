const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const About = sequelize.define(
  "About",
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
      allowNull: false,
    },
    description_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    peopleHelped: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    projectsCompleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    yearsExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX || ''}about`,
    timestamps: true,
  }
);

module.exports = About;
