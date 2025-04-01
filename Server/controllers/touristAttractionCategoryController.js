const TouristAttractionCategory = require('../models/touristAttractionCategoryModel');
const createImageUpload = require('../configs/multerConfig');
const path = require('path');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await TouristAttractionCategory.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        const { name_en, name_lo } = req.body;
        const image = req.file ? path.join(folder, req.file.filename) : null;
        
        const category = await TouristAttractionCategory.create({ 
          name_en, 
          name_lo,
          image 
        });
        
        res.status(201).json(category);
      } catch (error) {
        res.status(500).json({ error: error.message });
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
        const category = await TouristAttractionCategory.findByPk(id);

        if (!category) {
          return res.status(404).json({ message: "Category not found" });
        }

        const updateData = {
          ...req.body
        };

        if (req.file) {
          updateData.image = path.join(folder, req.file.filename);
        }

        await category.update(updateData);
        res.status(200).json(category);
      } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Error updating category", error });
      }
    }
  ];
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await TouristAttractionCategory.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error });
  }
}; 