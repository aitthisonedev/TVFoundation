const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');

const SupportCompany = sequelize.define(
  'SupportCompany',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameLA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descriptionLA: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    supportAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX}supportcompanies`,
    timestamps: true,
  }
);

module.exports = SupportCompany;
