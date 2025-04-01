const BankAccount = require("../models/bankAccountModel");
const createImageUpload = require("../configs/multerConfig");

exports.getAllBankAccounts = async (req, res) => {
  try {
    const bankAccounts = await BankAccount.findAll();
    const baseResponse = bankAccounts.map(account => ({
      ...account.toJSON(),
      logo: account.logo ? `/ImageUpload/${account.logo}` : null,
      ImageqrCodes_lak: account.ImageqrCodes_lak ? `/ImageUpload/${account.ImageqrCodes_lak}` : null,
      ImageqrCodes_usd: account.ImageqrCodes_usd ? `/ImageUpload/${account.ImageqrCodes_usd}` : null,
      ImageqrCodes_thb: account.ImageqrCodes_thb ? `/ImageUpload/${account.ImageqrCodes_thb}` : null,
    }));
    res.json(baseResponse);
  } catch (err) {
    console.error('Error fetching bank accounts:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createBankAccount = (folder) => {
  const imageUpload = createImageUpload(folder).fields([
    { name: 'logo', maxCount: 1 },
    { name: 'ImageqrCodes_lak', maxCount: 1 },
    { name: 'ImageqrCodes_usd', maxCount: 1 },
    { name: 'ImageqrCodes_thb', maxCount: 1 },
  ]);

  return [
    imageUpload,
    async (req, res) => {
      try {
        console.log('Received form data:', req.body); // Debug log
        console.log('Received files:', req.files); // Debug log

        const {
          BankName_en,
          BankName_lo,
          accountName,
          accounts_lak,
          accounts_usd,
          accounts_thb,
        } = req.body;

        // Validate required fields
        if (!BankName_en || !BankName_lo || !accountName || !accounts_lak || !accounts_usd || !accounts_thb) {
          return res.status(400).json({ 
            error: "Missing required fields",
            received: req.body 
          });
        }

        const bankAccount = await BankAccount.create({
          BankName_en,
          BankName_lo,
          accountName,
          accounts_lak,
          accounts_usd,
          accounts_thb,
          logo: req.files?.logo ? `${folder}/${req.files.logo[0].filename}` : null,
          ImageqrCodes_lak: req.files?.ImageqrCodes_lak ? `${folder}/${req.files.ImageqrCodes_lak[0].filename}` : null,
          ImageqrCodes_usd: req.files?.ImageqrCodes_usd ? `${folder}/${req.files.ImageqrCodes_usd[0].filename}` : null,
          ImageqrCodes_thb: req.files?.ImageqrCodes_thb ? `${folder}/${req.files.ImageqrCodes_thb[0].filename}` : null,
        });

        res.status(201).json(bankAccount);
      } catch (err) {
        console.error("Detailed error:", err); // Detailed error logging
        res.status(500).json({ 
          error: err.message,
          details: err.stack 
        });
      }
    },
  ];
};

exports.updateBankAccount = (folder) => {
  const imageUpload = createImageUpload(folder).fields([
    { name: 'logo', maxCount: 1 },
    { name: 'ImageqrCodes_lak', maxCount: 1 },
    { name: 'ImageqrCodes_usd', maxCount: 1 },
    { name: 'ImageqrCodes_thb', maxCount: 1 },
  ]);

  return [
    imageUpload,
    async (req, res) => {
      try {
        console.log('Update - Received form data:', req.body); // Debug log
        console.log('Update - Received files:', req.files); // Debug log

        const { id } = req.params;
        const {
          BankName_en,
          BankName_lo,
          accountName,
          accounts_lak,
          accounts_usd,
          accounts_thb,
        } = req.body;

        const existingAccount = await BankAccount.findOne({ where: { id } });

        if (!existingAccount) {
          return res.status(404).json({ error: "Bank account not found" });
        }

        const updates = {
          BankName_en: BankName_en || existingAccount.BankName_en,
          BankName_lo: BankName_lo || existingAccount.BankName_lo,
          accountName: accountName || existingAccount.accountName,
          accounts_lak: accounts_lak || existingAccount.accounts_lak,
          accounts_usd: accounts_usd || existingAccount.accounts_usd,
          accounts_thb: accounts_thb || existingAccount.accounts_thb,
        };

        // Only update image fields if new files are provided
        if (req.files?.logo) {
          updates.logo = `${folder}/${req.files.logo[0].filename}`;
        }
        if (req.files?.ImageqrCodes_lak) {
          updates.ImageqrCodes_lak = `${folder}/${req.files.ImageqrCodes_lak[0].filename}`;
        }
        if (req.files?.ImageqrCodes_usd) {
          updates.ImageqrCodes_usd = `${folder}/${req.files.ImageqrCodes_usd[0].filename}`;
        }
        if (req.files?.ImageqrCodes_thb) {
          updates.ImageqrCodes_thb = `${folder}/${req.files.ImageqrCodes_thb[0].filename}`;
        }

        await existingAccount.update(updates);
        res.status(200).json(existingAccount);
      } catch (err) {
        console.error("Detailed update error:", err); // Detailed error logging
        res.status(500).json({ 
          error: err.message,
          details: err.stack 
        });
      }
    },
  ];
};

exports.deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BankAccount.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send("Bank account deleted");
    } else {
      throw new Error("Bank account not found");
    }
  } catch (err) {
    console.error("Error deleting bank account:", err);
    res.status(500).json({ error: err.message });
  }
}; 