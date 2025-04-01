const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/auth');

// Public routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Protected routes - require authentication
router.post('/', authMiddleware, newsController.createNews('ImageUpload'));
router.put('/:id', authMiddleware, newsController.updateNews('ImageUpload'));
router.delete('/:id', authMiddleware, newsController.deleteNews);

module.exports = router;
