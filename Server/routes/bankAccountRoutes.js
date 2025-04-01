const express = require('express');
const bankAccountController = require('../controllers/bankAccountController');
const router = express.Router();

router.get('/', bankAccountController.getAllBankAccounts);
router.post('/', bankAccountController.createBankAccount('ImageUpload'));
router.put('/:id', bankAccountController.updateBankAccount('ImageUpload'));
router.delete('/:id', bankAccountController.deleteBankAccount);

module.exports = router; 