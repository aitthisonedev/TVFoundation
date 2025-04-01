const express = require('express');
const router = express.Router();
const SliderController = require('../controllers/SliderProjectController');

router.get('/', SliderController.getAllSliders);
router.get('/:id', SliderController.getSliderById);
router.post('/', SliderController.createOrUpdateSlider('sliders-project'));
router.delete('/:id', SliderController.deleteSlider);

module.exports = router; 