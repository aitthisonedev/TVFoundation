const About = require("../models/aboutModel");
const createImageUpload = require("../configs/multerConfig");

exports.getAllAbouts = async (req, res) => {
  try {
    const abouts = await About.findAll();
    const baseResponse = abouts.map(about => ({
      ...about.toJSON(),
      image: about.image ? `/ImageUpload/${about.image}` : null,
    }));
    res.json(baseResponse);
  } catch (err) {
    console.error('Error fetching abouts:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAboutById = async (req, res) => {
  try {
    const { id } = req.params;
    const about = await About.findOne({ where: { id } });

    if (!about) {
      return res.status(404).json({ error: "About not found" });
    }

    const response = {
      ...about.toJSON(),
      image: about.image ? `/ImageUpload/${about.image}` : null,
    };

    res.json(response);
  } catch (err) {
    console.error("Error fetching about by ID:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.createAbout = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        const {
          title_en,
          title_lo,
          description_en,
          description_lo,
          peopleHelped,
          projectsCompleted,
          yearsExperience,
        } = req.body;

        const image = req.file ? `${folder}/${req.file.filename}` : null;

        const about = await About.create({
          title_en,
          title_lo,
          description_en,
          description_lo,
          peopleHelped: parseInt(peopleHelped),
          projectsCompleted: parseInt(projectsCompleted),
          yearsExperience: parseInt(yearsExperience),
          image,
        });

        res.status(201).json(about);
      } catch (err) {
        console.error("Error creating about:", err);
        res.status(500).json({ error: err.message });
      }
    },
  ];
};

exports.updateAbout = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('image'),
    async (req, res) => {
      try {
        const { id } = req.params;
        const {
          title_en,
          title_lo,
          description_en,
          description_lo,
          peopleHelped,
          projectsCompleted,
          yearsExperience,
        } = req.body;

        const existingAbout = await About.findOne({ where: { id } });

        if (!existingAbout) {
          return res.status(404).json({ error: "About not found" });
        }

        existingAbout.title_en = title_en || existingAbout.title_en;
        existingAbout.title_lo = title_lo || existingAbout.title_lo;
        existingAbout.description_en = description_en || existingAbout.description_en;
        existingAbout.description_lo = description_lo || existingAbout.description_lo;
        existingAbout.peopleHelped = peopleHelped ? parseInt(peopleHelped) : existingAbout.peopleHelped;
        existingAbout.projectsCompleted = projectsCompleted ? parseInt(projectsCompleted) : existingAbout.projectsCompleted;
        existingAbout.yearsExperience = yearsExperience ? parseInt(yearsExperience) : existingAbout.yearsExperience;

        if (req.file) {
          existingAbout.image = `${folder}/${req.file.filename}`;
        }

        await existingAbout.save();
        res.status(200).json(existingAbout);
      } catch (err) {
        console.error("Error updating about:", err);
        res.status(500).json({ error: err.message });
      }
    },
  ];
};

exports.deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await About.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send("About deleted");
    } else {
      throw new Error("About not found");
    }
  } catch (err) {
    console.error("Error deleting about:", err);
    res.status(500).json({ error: err.message });
  }
};
