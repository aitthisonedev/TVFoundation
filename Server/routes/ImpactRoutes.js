const express = require('express');
const ImpactController = require('../controllers/ImpactController');
const router = express.Router();

router.get('/', ImpactController.getAllImpacts);
router.post('/', ImpactController.createImpact('ImageUpload'));
router.put('/:id', ImpactController.updateImpact('ImageUpload'));
router.delete('/:id', ImpactController.deleteImpact);

module.exports = router; 