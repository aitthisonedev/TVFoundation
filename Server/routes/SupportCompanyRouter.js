const express = require('express');
const router = express.Router();
const SupportCompanyController = require('../controllers/SupportCompanyController');

router.get('/', SupportCompanyController.getAllSupportCompanies);
router.get('/:id', SupportCompanyController.getSupportCompanyById);
router.post('/', SupportCompanyController.createOrUpdateSupportCompany('supportcompanies'));
router.delete('/:id', SupportCompanyController.deleteSupportCompany);

module.exports = router;
