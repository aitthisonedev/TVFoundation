const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const ProjectStatus = require('./projectStatusModel');

const Project = sequelize.define(
  'Project',
  {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
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
    content_en: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content_lo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProjectStatus,
        key: 'id'
      }
    },
    currentAmount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    targetAmount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    supporters: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX}projects`,
    timestamps: true,
  }
);

Project.belongsTo(ProjectStatus, {
  foreignKey: 'status_id',
  as: 'status'
});

module.exports = Project;


