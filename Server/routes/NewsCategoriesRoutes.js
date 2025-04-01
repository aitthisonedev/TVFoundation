const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/NewsCategoriesController');
const authMiddleware = require('../middlewares/auth');

// Apply auth middleware to all routes in this router
router.use(authMiddleware);

// Define routes
router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router; 