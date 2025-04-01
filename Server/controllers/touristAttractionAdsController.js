const TouristAttractionAds = require('../models/touristAttractionAdsModel');
const createImageUpload = require('../configs/multerConfig');
const path = require('path');

exports.getAllAds = async (req, res) => {
  try {
    const ads = await TouristAttractionAds.findAll();
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAd = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        const { name_en, name_lo } = req.body;
        const image = req.file ? path.join(folder, req.file.filename) : null;
        
        const ad = await TouristAttractionAds.create({ 
          name_en, 
          name_lo,
          image 
        });
        
        res.status(201).json(ad);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  ];
};

exports.updateAd = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        const { id } = req.params;
        const ad = await TouristAttractionAds.findByPk(id);

        if (!ad) {
          return res.status(404).json({ message: "Ad not found" });
        }

        const updateData = {
          ...req.body
        };

        if (req.file) {
          updateData.image = path.join(folder, req.file.filename);
        }

        await ad.update(updateData);
        res.status(200).json(ad);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  ];
};

exports.deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await TouristAttractionAds.findByPk(id);

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    await ad.destroy();
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 