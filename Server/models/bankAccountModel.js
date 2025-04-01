const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const BankAccount = sequelize.define(
  "BankAccount",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    BankName_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    BankName_lo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accounts_lak: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accounts_usd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accounts_thb: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ImageqrCodes_lak: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ImageqrCodes_usd: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ImageqrCodes_thb: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: `${process.env.TB_PREFIX}bank_accounts`,
    timestamps: false,
  }
);

module.exports = BankAccount; 