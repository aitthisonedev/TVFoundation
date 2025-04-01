const SliderNews = require('../models/SliderNewsModel');
const path = require('path');
const createImageUpload = require('../configs/multerConfig');

// Get all sliders
exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await SliderNews.findAll();
    const baseResponse = sliders.map(item => ({
      ...item.toJSON(),
      imageUrl: item.image ? `${req.protocol}://${req.get('host')}/ImageUpload/${item.image}` : null,
    }));
    res.json(baseResponse);
  } catch (err) {
    console.error('Error fetching sliders:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get slider by ID
exports.getSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const slider = await SliderNews.findOne({ where: { id } });

    if (!slider) {
      return res.status(404).json({ error: 'Slider not found' });
    }

    const imageUrl = slider.image ? `${req.protocol}://${req.get('host')}/ImageUpload/${slider.image}` : null;
    res.json({ ...slider.toJSON(), image: imageUrl });
  } catch (err) {
    console.error('Error fetching slider by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create or update slider
exports.createOrUpdateSlider = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        const { id, title_en, title_lo, description_en, description_lo } = req.body;
        const image = req.file ? path.join(folder, req.file.filename) : null;

        let slider;
        if (id) {
          slider = await SliderNews.findByPk(id);
          if (slider) {
            if (image) {
              slider.image = image;
            }
            slider.title_en = title_en;
            slider.title_lo = title_lo;
            slider.description_en = description_en;
            slider.description_lo = description_lo;
            await slider.save();
          }
        } else {
          slider = await SliderNews.create({
            title_en,
            title_lo,
            description_en,
            description_lo,
            image
          });
        }
        res.status(200).json(slider);
      } catch (err) {
        console.error('Error creating or updating slider:', err);
        res.status(500).json({ error: err.message });
      }
    },
  ];
};

// Delete slider
exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SliderNews.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send('Slider deleted');
    } else {
      throw new Error('Slider not found');
    }
  } catch (err) {
    console.error('Error deleting slider:', err);
    res.status(500).json({ error: err.message });
  }
}; 