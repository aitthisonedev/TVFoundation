const CoreValues = require("../models/CoreValuesModel");
const createImageUpload = require("../configs/multerConfig");

exports.getAllCoreValues = async (req, res) => {
  try {
    const coreValues = await CoreValues.findAll();
    const response = coreValues.map(value => ({
      ...value.toJSON(),
      image: value.image ? `/ImageUpload/${value.image}` : null,
    }));
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching core values:', error);
    res.status(500).json({ error: 'Failed to fetch core values' });
  }
};

exports.createCoreValues = (uploadFolder) => {
  const uploadMiddleware = createImageUpload(uploadFolder);
  return [
    uploadMiddleware.single('image'),
    async (req, res) => {
      try {
        console.log('Request body:', req.body);
        
        const { 
          title_en, 
          title_lo, 
          description_en, 
          description_lo 
        } = req.body;

        if (!title_en || !title_lo || !description_en || !description_lo) {
          return res.status(400).json({ 
            error: "All fields are required except image",
            receivedData: req.body 
          });
        }

        const imagePath = req.file ? `${uploadFolder}/${req.file.filename}` : null;

        const newCoreValue = await CoreValues.create({
          title_en,
          title_lo,
          description_en,
          description_lo,
          image: imagePath,
        });

        res.status(201).json(newCoreValue);
      } catch (error) {
        console.error("Error creating core value:", error);
        res.status(500).json({ 
          error: "Failed to create core value.",
          details: error.message
        });
      }
    },
  ];
};

exports.updateCoreValues = (uploadFolder) => {
  const uploadMiddleware = createImageUpload(uploadFolder);
  return [
    uploadMiddleware.single('image'),
    async (req, res) => {
      try {
        const { id } = req.params;
        const { 
          title_en, 
          title_lo, 
          description_en, 
          description_lo 
        } = req.body;

        const existingCoreValue = await CoreValues.findOne({ where: { id } });
        if (!existingCoreValue) {
          return res.status(404).json({ error: "Core value not found." });
        }

        const updates = {
          title_en: title_en || existingCoreValue.title_en,
          title_lo: title_lo || existingCoreValue.title_lo,
          description_en: description_en || existingCoreValue.description_en,
          description_lo: description_lo || existingCoreValue.description_lo,
        };

        if (req.file) {
          updates.image = `${uploadFolder}/${req.file.filename}`;
        }

        await existingCoreValue.update(updates);
        res.status(200).json(existingCoreValue);
      } catch (error) {
        console.error("Error updating core value:", error);
        res.status(500).json({ 
          error: "Failed to update core value.",
          details: error.message
        });
      }
    },
  ];
};

exports.deleteCoreValues = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CoreValues.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Core value not found." });
    }
  } catch (error) {
    console.error("Error deleting core value:", error);
    res.status(500).json({ 
      error: "Failed to delete core value.",
      details: error.message
    });
  }
};