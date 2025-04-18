const express = require('express');
const router = express.Router();
const SliderController = require('../controllers/SliderNewsController');

router.get('/', SliderController.getAllSliders);
router.get('/:id', SliderController.getSliderById);
router.post('/', SliderController.createOrUpdateSlider('sliders-news'));
router.delete('/:id', SliderController.deleteSlider);

module.exports = router; 