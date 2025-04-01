const TouristAttraction = require('../models/touristAttractionModel');
const TouristAttractionCategory = require('../models/touristAttractionCategoryModel');
const path = require('path');
const createImageUpload = require('../configs/multerConfig');

exports.getAllAttractions = async (req, res) => {
  try {
    const attractions = await TouristAttraction.findAll({
      include: [{
        model: TouristAttractionCategory,
        as: 'category'
      }]
    });
    res.json(attractions);
  } catch (err) {
    console.error('Error fetching attractions:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAttractionById = async (req, res) => {
  try {
    const { id } = req.params;
    const attraction = await TouristAttraction.findOne({ 
      where: { attraction_id: id },
      include: [{
        model: TouristAttractionCategory,
        as: 'category'
      }]
    });

    if (!attraction) {
      return res.status(404).json({ error: 'Attraction not found' });
    }

    res.json(attraction);
  } catch (err) {
    console.error('Error fetching attraction:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createAttraction = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.fields([
      { name: 'image', maxCount: 1 }, 
      { name: 'images', maxCount: 10 }
    ]),
    async (req, res) => {
      try {
        const {
          name_en,
          name_lo,
          description_en,
          description_lo,
          location_en,
          location_lo,
          Duration_en,
          Duration_lo,
          GroupSize_en,
          GroupSize_lo,
          language_en,
          language_lo,
          Available_en,
          Available_lo,
          content_en,
          content_lo,
          ExpectOne_en,
          ExpectOne_lo,
          ExpectTwo_en,
          ExpectTwo_lo,
          ExpectThree_en,
          ExpectThree_lo,
          category_id
        } = req.body;

        const mainImage = req.files['image'] ? 
          path.join(folder, req.files['image'][0].filename) : null;
        const additionalImages = req.files['images'] ? 
          req.files['images'].map(file => path.join(folder, file.filename)) : [];

        const attraction = await TouristAttraction.create({
          name_en,
          name_lo,
          description_en,
          description_lo,
          location_en,
          location_lo,
          Duration_en,
          Duration_lo,
          GroupSize_en,
          GroupSize_lo,
          language_en,
          language_lo,
          Available_en,
          Available_lo,
          content_en,
          content_lo,
          ExpectOne_en,
          ExpectOne_lo,
          ExpectTwo_en,
          ExpectTwo_lo,
          ExpectThree_en,
          ExpectThree_lo,
          category_id,
          image: mainImage,
          images: additionalImages
        });

        res.status(201).json(attraction);
      } catch (err) {
        console.error('Error creating attraction:', err);
        res.status(500).json({ error: err.message });
      }
    }
  ];
};

exports.updateAttraction = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.fields([
      { name: 'image', maxCount: 1 }, 
      { name: 'images', maxCount: 10 }
    ]),
    async (req, res) => {
      try {
        const { id } = req.params;
        const attraction = await TouristAttraction.findOne({ 
          where: { attraction_id: id } 
        });

        if (!attraction) {
          return res.status(404).json({ error: 'Attraction not found' });
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

        await attraction.update(updateData);
        
        const updatedAttraction = await TouristAttraction.findOne({ 
          where: { attraction_id: id },
          include: [{
            model: TouristAttractionCategory,
            as: 'category'
          }]
        });
        
        res.json(updatedAttraction);
      } catch (err) {
        console.error('Error updating attraction:', err);
        res.status(500).json({ error: err.message });
      }
    }
  ];
};

exports.deleteAttraction = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TouristAttraction.destroy({
      where: { attraction_id: id }
    });
    
    if (deleted) {
      res.status(204).send("Attraction deleted");
    } else {
      throw new Error("Attraction not found");
    }
  } catch (err) {
    console.error('Error deleting attraction:', err);
    res.status(500).json({ error: err.message });
  }
}; 