const express = require('express');
const router = express.Router();
const touristAttractionSlideController = require('../controllers/touristAttractionSlideController');
const authMiddleware = require('../middlewares/auth');

const folder = 'tourist-attraction-slides';

router.get('/', touristAttractionSlideController.getAllSlides);
router.post('/', authMiddleware, touristAttractionSlideController.createSlide(folder));
router.put('/:id', authMiddleware, touristAttractionSlideController.updateSlide(folder));
router.delete('/:id', authMiddleware, touristAttractionSlideController.deleteSlide);

module.exports = router; 