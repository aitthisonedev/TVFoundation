const express = require('express');
const router = express.Router();
const SliderController = require('../controllers/SliderHomeController');

router.get('/', SliderController.getAllSliders);
router.get('/:id', SliderController.getSliderById);
router.post('/', SliderController.createOrUpdateSlider('sliders-home'));
router.delete('/:id', SliderController.deleteSlider);

module.exports = router; 