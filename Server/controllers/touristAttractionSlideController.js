const TouristAttractionSlide = require('../models/touristAttractionSlideModel');
const createImageUpload = require('../configs/multerConfig');
const path = require('path');

exports.getAllSlides = async (req, res) => {
  try {
    const slides = await TouristAttractionSlide.findAll();
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSlide = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        const { name_en, name_lo } = req.body;
        const image = req.file ? path.join(folder, req.file.filename) : null;
        
        const slide = await TouristAttractionSlide.create({ 
          name_en, 
          name_lo,
          image 
        });
        
        res.status(201).json(slide);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  ];
};

exports.updateSlide = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        const { id } = req.params;
        const slide = await TouristAttractionSlide.findByPk(id);

        if (!slide) {
          return res.status(404).json({ message: "Slide not found" });
        }

        const updateData = {
          ...req.body
        };

        if (req.file) {
          updateData.image = path.join(folder, req.file.filename);
        }

        await slide.update(updateData);
        res.status(200).json(slide);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  ];
};

exports.deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const slide = await TouristAttractionSlide.findByPk(id);

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    await slide.destroy();
    res.status(200).json({ message: "Slide deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 