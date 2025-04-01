const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');
const NewsCategory = require('./newsCategoryModel');
const User = require('./usersModel');

const News = sequelize.define(
  'News',
  {
    news_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name_lo: {
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
      allowNull: false,
    },
    content_lo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location_en: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location_lo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    caption_en: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    caption_lo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tags_en: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tags_lo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: NewsCategory,
        key: 'id'
      }
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: `${process.env.TB_PREFIX}users`,
        key: 'id'
      }
    }
  },
  {
    tableName: `${process.env.TB_PREFIX}news`,
    timestamps: true,
  }
);

News.belongsTo(NewsCategory, {
  foreignKey: 'category_id',
  as: 'category'
});

News.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author',
  targetKey: 'id',
  constraints: false
});

module.exports = News; 