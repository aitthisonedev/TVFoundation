const express = require('express');
const router = express.Router();
const projectStatusController = require('../controllers/projectStatusController');

router.get('/', projectStatusController.getAllProjectStatuses);
router.post('/', projectStatusController.createProjectStatus);
router.put('/:id', projectStatusController.updateStatus);
router.delete('/:id', projectStatusController.deleteStatus);

module.exports = router; 