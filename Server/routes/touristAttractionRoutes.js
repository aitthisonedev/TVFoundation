const express = require('express');
const router = express.Router();
const touristAttractionController = require('../controllers/touristAttractionController');

const folder = 'tourist-attractions';

router.get('/', touristAttractionController.getAllAttractions);
router.get('/:id', touristAttractionController.getAttractionById);
router.post('/', touristAttractionController.createAttraction(folder));
router.put('/:id', touristAttractionController.updateAttraction(folder));
router.delete('/:id', touristAttractionController.deleteAttraction);

module.exports = router; 