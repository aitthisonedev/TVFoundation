const express = require('express');
const router = express.Router();
const productCategoryController = require('../controllers/productCategoryController');

const folder = 'product-categories';

router.get('/', productCategoryController.getAllCategories);
router.post('/', productCategoryController.createCategory(folder));
router.put('/:id', productCategoryController.updateCategory(folder));
router.delete('/:id', productCategoryController.deleteCategory);

module.exports = router; 