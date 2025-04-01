const News = require('../models/newsModel');
const NewsCategory = require('../models/newsCategoryModel');
const path = require('path');
const createImageUpload = require('../configs/multerConfig');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

const validateNewsData = (data) => {
  const requiredFields = [
    'name_en', 'name_lo', 
    'description_en', 'description_lo',
    'content_en', 'content_lo',
    'location_en', 'location_lo',
    'category_id'
  ];

  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

exports.getAllNews = async (req, res) => {
  try {
    const news = await News.findAll({
      include: [
        {
          model: NewsCategory,
          as: 'category'
        }
      ]
    });
    res.json(news);
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findOne({
      where: { news_id: id },
      include: [
        {
          model: NewsCategory,
          as: 'category'
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'lastname', 'profile_image']
        }
      ]
    });

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json(news);
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createNews = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 }
    ]),
    async (req, res) => {
      try {
        validateNewsData(req.body);
        
        // Get user ID from token
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const newsData = {
          ...req.body,
          userId: userId, // Add userId to news data
          image: req.files?.['image'] ? path.join(folder, req.files['image'][0].filename) : null,
          images: req.files?.['images'] ? req.files['images'].map(file => path.join(folder, file.filename)) : []
        };

        const news = await News.create(newsData);
        
        const newsWithRelations = await News.findOne({
          where: { news_id: news.news_id },
          include: [
            { 
              model: NewsCategory, 
              as: 'category' 
            },
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'lastname', 'profile_image']
            }
          ]
        });

        res.status(201).json(newsWithRelations);
      } catch (err) {
        console.error('Error creating news:', err);
        res.status(400).json({ error: err.message });
      }
    }
  ];
};

exports.updateNews = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'images', maxCount: 10 }
    ]),
    async (req, res) => {
      try {
        const { id } = req.params;
        const news = await News.findOne({ where: { news_id: id } });

        if (!news) {
          return res.status(404).json({ error: 'News not found' });
        }

        let finalImages = [];
        
        if (req.body.existingImages) {
          try {
            finalImages = JSON.parse(req.body.existingImages);
          } catch (error) {
            console.error('Error parsing existingImages:', error);
          }
        }

        if (req.files && req.files['images']) {
          const newImages = req.files['images'].map(file => 
            path.join(folder, file.filename)
          );
          finalImages = [...finalImages, ...newImages];
        }

        const updateData = {
          ...req.body,
          images: finalImages
        };

        if (req.files && req.files['image']) {
          updateData.image = path.join(folder, req.files['image'][0].filename);
        }

        delete updateData.existingImages;

        await news.update(updateData);
        
        const updatedNews = await News.findOne({
          where: { news_id: id },
          include: [
            {
              model: NewsCategory,
              as: 'category'
            }
          ]
        });
        
        res.json(updatedNews);
      } catch (err) {
        console.error('Error updating news:', err);
        res.status(500).json({ error: err.message });
      }
    }
  ];
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await News.destroy({
      where: { news_id: id }
    });
    
    if (deleted) {
      res.status(204).send("News deleted");
    } else {
      throw new Error("News not found");
    }
  } catch (err) {
    console.error('Error deleting news:', err);
    res.status(500).json({ error: err.message });
  }
}; 