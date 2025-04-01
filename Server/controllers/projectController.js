const Project = require('../models/projectModel');
const fs = require('fs');
const path = require('path');
const createImageUpload = require('../configs/multerConfig');
const jwt = require('jsonwebtoken');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ where: { project_id: id } });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    console.error('Error fetching project by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create project
exports.createProject = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'subImages', maxCount: 10 }]),
    async (req, res) => {
      try {
        const {
          title_en,
          title_lo,
          description_en,
          description_lo,
          content_en,
          content_lo,
          location_en,
          location_lo,
          status_id,
          currentAmount,
          targetAmount,
          supporters,
          start_date,
          end_date
        } = req.body;

        // Check for required fields
        if (!title_en || !title_lo || !description_en || !description_lo || 
            !location_en || !location_lo || !status_id || !start_date || !end_date) {
          return res.status(400).json({ error: 'Required fields are missing.' });
        }

        const coverImage = req.files['coverImage'] ? req.files['coverImage'][0].filename : null;
        const subImages = req.files['subImages'] ? req.files['subImages'].map(file => path.join(folder, file.filename)) : [];

        let userId;
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
        } catch (error) {
          return res.status(401).json({ error: 'Invalid or missing token' });
        }

        const project = await Project.create({
          title_en,
          title_lo,
          description_en,
          description_lo,
          content_en,
          content_lo,
          location_en,
          location_lo,
          status_id,
          currentAmount: currentAmount || 0,
          targetAmount: targetAmount || 0,
          supporters: supporters || 0,
          coverImage: coverImage ? path.join(folder, coverImage) : null,
          subImages,
          start_date,
          end_date,
          user_id: userId
        });

        res.status(201).json(project);
      } catch (err) {
        console.error('Error creating project:', err);
        res.status(500).json({ error: err.message });
      }
    }
  ];
};

// Update project
exports.updateProject = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.fields([
      { name: 'coverImage', maxCount: 1 }, 
      { name: 'subImages', maxCount: 10 }
    ]),
    async (req, res) => {
      try {
        const { id } = req.params;
        const existingProject = await Project.findOne({ where: { project_id: id } });

        if (!existingProject) {
          return res.status(404).json({ error: 'Project not found' });
        }

        // Handle subImages
        let finalSubImages = [];
        
        // Add existing images if provided
        if (req.body.existingSubImages) {
          try {
            const existingSubImages = JSON.parse(req.body.existingSubImages);
            finalSubImages = existingSubImages;
          } catch (error) {
            console.error('Error parsing existingSubImages:', error);
          }
        }

        // Add newly uploaded images
        if (req.files && req.files['subImages']) {
          const newSubImages = req.files['subImages'].map(file => 
            path.join(folder, file.filename)
          );
          finalSubImages = [...finalSubImages, ...newSubImages];
        }

        // Update project data
        const updatedData = {
          ...req.body,
          subImages: finalSubImages
        };

        // Handle cover image if uploaded
        if (req.files && req.files['coverImage']) {
          updatedData.coverImage = path.join(folder, req.files['coverImage'][0].filename);
        }

        // Remove fields that shouldn't be updated directly
        delete updatedData.existingSubImages;

        // Save updates
        await existingProject.update(updatedData);
        
        // Fetch fresh data to return
        const updatedProject = await Project.findOne({ where: { project_id: id } });
        res.json(updatedProject);
      } catch (err) {
        console.error('Error updating project:', err);
        res.status(500).json({ error: err.message });
      }
    }
  ];
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.destroy({
      where: { project_id: id }
    });
    if (deleted) {
      res.status(204).send("Project deleted");
    } else {
      throw new Error("Project not found");
    }
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: err.message });
  }
};