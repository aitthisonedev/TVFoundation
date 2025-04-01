const VisionMission = require("../models/visionMissionModel");

exports.getAllVisionMission = async (req, res) => {
  try {
    const visionMission = await VisionMission.findAll();
    res.json(visionMission);
  } catch (err) {
    console.error('Error fetching vision & mission:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createVisionMission = async (req, res) => {
  try {
    const visionMission = await VisionMission.create(req.body);
    res.status(201).json(visionMission);
  } catch (err) {
    console.error("Error creating vision & mission:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateVisionMission = async (req, res) => {
  try {
    const { id } = req.params;
    const existingVisionMission = await VisionMission.findOne({ where: { id } });

    if (!existingVisionMission) {
      return res.status(404).json({ error: "Vision & Mission not found" });
    }

    await existingVisionMission.update(req.body);
    res.status(200).json(existingVisionMission);
  } catch (err) {
    console.error("Error updating vision & mission:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteVisionMission = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await VisionMission.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send("Vision & Mission deleted");
    } else {
      throw new Error("Vision & Mission not found");
    }
  } catch (err) {
    console.error("Error deleting vision & mission:", err);
    res.status(500).json({ error: err.message });
  }
}; 