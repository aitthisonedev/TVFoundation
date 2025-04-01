const express = require('express');
const router = express.Router();
const productAdsController = require('../controllers/productAdsController');
const authMiddleware = require('../middlewares/auth');

const folder = 'product-ads';

router.get('/', productAdsController.getAllAds);
router.post('/', authMiddleware, productAdsController.createAd(folder));
router.put('/:id', authMiddleware, productAdsController.updateAd(folder));
router.delete('/:id', authMiddleware, productAdsController.deleteAd);

module.exports = router; 