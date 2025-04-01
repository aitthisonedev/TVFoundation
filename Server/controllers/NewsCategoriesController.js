const NewsCategory = require('../models/newsCategoryModel');
const createImageUpload = require('../configs/multerConfig');
const path = require('path');

const validateCategoryData = (data) => {
  const requiredFields = ['name_en', 'name_lo'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await NewsCategory.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCategory = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        validateCategoryData(req.body);
        
        const categoryData = {
          ...req.body,
          image: req.file ? path.join(folder, req.file.filename) : null
        };

        const category = await NewsCategory.create(categoryData);
        res.status(201).json(category);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  ];
};

exports.updateCategory = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        const { id } = req.params;
        const category = await NewsCategory.findByPk(id);
        
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }

        validateCategoryData(req.body);
        
        const updateData = {
          ...req.body
        };

        if (req.file) {
          updateData.image = path.join(folder, req.file.filename);
        }

        await category.update(updateData);
        const updatedCategory = await NewsCategory.findByPk(id);
        
        res.json(updatedCategory);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    }
  ];
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NewsCategory.destroy({
      where: { id }
    });
    
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 