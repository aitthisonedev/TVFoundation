const express = require('express');
const router = express.Router();
const touristAttractionAdsController = require('../controllers/touristAttractionAdsController');
const authMiddleware = require('../middlewares/auth');

const folder = 'tourist-attraction-ads';

router.get('/', touristAttractionAdsController.getAllAds);
router.post('/', authMiddleware, touristAttractionAdsController.createAd(folder));
router.put('/:id', authMiddleware, touristAttractionAdsController.updateAd(folder));
router.delete('/:id', authMiddleware, touristAttractionAdsController.deleteAd);

module.exports = router; 