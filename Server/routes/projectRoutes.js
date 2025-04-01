const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

const folder = 'projects';

router.get('/', projectController.getAllProjects);
router.get('/getById/:id', projectController.getProjectById);
router.post('/', projectController.createProject(folder));
router.put('/:id', projectController.updateProject(folder));
router.delete('/:id', projectController.deleteProject);

module.exports = router;

