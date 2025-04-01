const express = require('express');
const visionMissionController = require('../controllers/visionMissionController');
const router = express.Router();

router.get('/', visionMissionController.getAllVisionMission);
router.post('/', visionMissionController.createVisionMission);
router.put('/:id', visionMissionController.updateVisionMission);
router.delete('/:id', visionMissionController.deleteVisionMission);

module.exports = router; 