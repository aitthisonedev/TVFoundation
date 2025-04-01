const express = require('express');
const router = express.Router();
const productSlideController = require('../controllers/productSlideController');
const authMiddleware = require('../middlewares/auth');

const folder = 'product-slides';

router.get('/', productSlideController.getAllSlides);
router.post('/', authMiddleware, productSlideController.createSlide(folder));
router.put('/:id', authMiddleware, productSlideController.updateSlide(folder));
router.delete('/:id', authMiddleware, productSlideController.deleteSlide);

module.exports = router; 