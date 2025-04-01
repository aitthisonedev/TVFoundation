const express = require('express');
const router = express.Router();
const touristAttractionCategoryController = require('../controllers/touristAttractionCategoryController');

const folder = 'tourist-attraction-categories';

router.get('/', touristAttractionCategoryController.getAllCategories);
router.post('/', touristAttractionCategoryController.createCategory(folder));
router.put('/:id', touristAttractionCategoryController.updateCategory(folder));
router.delete('/:id', touristAttractionCategoryController.deleteCategory);

module.exports = router; 