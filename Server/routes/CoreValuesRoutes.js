const express = require('express');
const CoreValuesController = require('../controllers/CoreValuesController');
const router = express.Router();

router.get('/', CoreValuesController.getAllCoreValues);
router.post('/', CoreValuesController.createCoreValues('ImageUpload'));
router.put('/:id', CoreValuesController.updateCoreValues('ImageUpload'));
router.delete('/:id', CoreValuesController.deleteCoreValues);

module.exports = router;