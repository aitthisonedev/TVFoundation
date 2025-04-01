const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const folder = 'products';

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct(folder));
router.put('/:id', productController.updateProduct(folder));
router.delete('/:id', productController.deleteProduct);

module.exports = router; 