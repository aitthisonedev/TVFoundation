const Impact = require("../models/ImpactModel");
const createImageUpload = require("../configs/multerConfig");

exports.getAllImpacts = async (req, res) => {
  try {
    const impacts = await Impact.findAll();
    const response = impacts.map(impact => ({
      ...impact.toJSON(),
      image: impact.image ? `/ImageUpload/${impact.image}` : null,
    }));
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching Impacts:', error);
    res.status(500).json({ error: 'Failed to fetch impacts' });
  }
};

exports.createImpact = (uploadFolder) => {
  const uploadMiddleware = createImageUpload(uploadFolder);
  return [
    uploadMiddleware.single('image'),
    async (req, res) => {
      try {
        console.log('Request body:', req.body); // Debug log
        
        const { 
          title_en, 
          title_lo, 
          description_en, 
          description_lo,
          helped,
          caption_en,
          caption_lo
        } = req.body;

        // Validate required fields
        if (!title_en || !title_lo || !description_en || !description_lo || !caption_en || !caption_lo) {
          return res.status(400).json({ 
            error: "All fields are required except image",
            receivedData: req.body 
          });
        }

        const imagePath = req.file ? `${uploadFolder}/${req.file.filename}` : null;
        console.log('Image path:', imagePath); // Debug log

        const newImpact = await Impact.create({
          title_en,
          title_lo,
          description_en,
          description_lo,
          helped: parseInt(helped) || 0,
          caption_en,
          caption_lo,
          image: imagePath,
        });

        console.log('Created impact:', newImpact.toJSON()); // Debug log
        res.status(201).json(newImpact);
      } catch (error) {
        console.error("Error creating Impact:", error);
        res.status(500).json({ 
          error: "Failed to create impact.",
          details: error.message,
          stack: error.stack
        });
      }
    },
  ];
};

exports.updateImpact = (uploadFolder) => {
  const uploadMiddleware = createImageUpload(uploadFolder);
  return [
    uploadMiddleware.single('image'),
    async (req, res) => {
      try {
        console.log('Update request body:', req.body); // Debug log
        
        const { id } = req.params;
        const { 
          title_en, 
          title_lo, 
          description_en, 
          description_lo,
          helped,
          caption_en,
          caption_lo
        } = req.body;

        const existingImpact = await Impact.findOne({ where: { id } });
        if (!existingImpact) {
          return res.status(404).json({ error: "Impact not found." });
        }

        const updates = {
          title_en: title_en || existingImpact.title_en,
          title_lo: title_lo || existingImpact.title_lo,
          description_en: description_en || existingImpact.description_en,
          description_lo: description_lo || existingImpact.description_lo,
          helped: parseInt(helped) || existingImpact.helped,
          caption_en: caption_en || existingImpact.caption_en,
          caption_lo: caption_lo || existingImpact.caption_lo,
        };

        if (req.file) {
          updates.image = `${uploadFolder}/${req.file.filename}`;
        }

        console.log('Updates:', updates); // Debug log

        await existingImpact.update(updates);
        res.status(200).json(existingImpact);
      } catch (error) {
        console.error("Error updating Impact:", error);
        res.status(500).json({ 
          error: "Failed to update impact.",
          details: error.message,
          stack: error.stack
        });
      }
    },
  ];
};

exports.deleteImpact = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting impact with id:', id); // Debug log

    const deleted = await Impact.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Impact not found." });
    }
  } catch (error) {
    console.error("Error deleting Impact:", error);
    res.status(500).json({ 
      error: "Failed to delete impact.",
      details: error.message,
      stack: error.stack
    });
  }
}; 