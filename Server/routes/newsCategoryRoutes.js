const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/NewsCategoriesController');

router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory('news-categories'));
router.put('/:id', categoryController.updateCategory('news-categories'));
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 