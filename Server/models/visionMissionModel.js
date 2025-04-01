const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const VisionMission = sequelize.define(
  "VisionMission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vision_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vision_lo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visionDescription_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visionDescription_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visionContentOne_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visionContentOne_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visionContentTwo_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visionContentTwo_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visionContentThree_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visionContentThree_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mission_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mission_lo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    missionDescription_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    missionDescription_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    missionContentOne_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    missionContentOne_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    missionContentTwo_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    missionContentTwo_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    missionContentThree_en: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    missionContentThree_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX || ''}vision_mission`,
    timestamps: true,
  }
);

module.exports = VisionMission; 