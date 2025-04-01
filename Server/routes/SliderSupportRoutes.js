const express = require('express');
const router = express.Router();
const SliderController = require('../controllers/SliderSupportController');

router.get('/', SliderController.getAllSliders);
router.get('/:id', SliderController.getSliderById);
router.post('/', SliderController.createOrUpdateSlider('sliders-support'));
router.delete('/:id', SliderController.deleteSlider);

module.exports = router; 