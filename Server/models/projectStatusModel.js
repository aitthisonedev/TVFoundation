const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const ProjectStatus = sequelize.define(
  'ProjectStatus',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status_name_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_name_lo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX}project_status`,
    timestamps: true,
  }
);

module.exports = ProjectStatus; 