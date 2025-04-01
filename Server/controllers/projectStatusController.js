const ProjectStatus = require('../models/projectStatusModel');

exports.getAllProjectStatuses = async (req, res) => {
  try {
    const statuses = await ProjectStatus.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProjectStatus = async (req, res) => {
  try {
    const { status_name_en, status_name_lo } = req.body;
    const projectStatus = await ProjectStatus.create({ status_name_en, status_name_lo });
    res.status(201).json(projectStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  const statusId = req.params.id;
  const { status_name_en, status_name_lo } = req.body;

  try {
    const status = await ProjectStatus.findByPk(statusId);

    if (!status) {
      return res.status(404).json({ message: "Status not found" });
    }

    status.status_name_en = status_name_en || status.status_name_en;
    status.status_name_lo = status_name_lo || status.status_name_lo;

    await status.save();

    res.status(200).json({ message: "Status updated successfully", status });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "An error occurred while updating the status", error });
  }
};

exports.deleteStatus = async (req, res) => {
  const statusId = req.params.id;

  try {
    const status = await ProjectStatus.findByPk(statusId);

    if (!status) {
      return res.status(404).json({ message: "Project status not found" });
    }

    await status.destroy();
    res.status(200).json({ message: "Project status deleted successfully" });
  } catch (error) {
    console.error("Error deleting status:", error);
    res.status(500).json({ message: "An error occurred while deleting the status", error });
  }
}; 