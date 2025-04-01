const SupportCompany = require('../models/SupportCompanyModel');
const path = require('path');
const fs = require('fs');
const createImageUpload = require('../configs/multerConfig');

// Get all support companies
exports.getAllSupportCompanies = async (req, res) => {
  try {
    const supportCompanies = await SupportCompany.findAll();
    const baseResponse = supportCompanies.map(item => {
      const logoUrl = item.logo ? `${req.protocol}://${req.get('host')}/ImageUpload/${item.logo}` : null;
      return {
        ...item.toJSON(),
        logo: logoUrl,
      };
    });
    res.json(baseResponse);
  } catch (err) {
    console.error('Error fetching support companies:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get support company by ID
exports.getSupportCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const supportCompany = await SupportCompany.findOne({ where: { id } });

    if (!supportCompany) {
      return res.status(404).json({ error: 'Support company not found' });
    }

    const logoUrl = supportCompany.logo ? `${req.protocol}://${req.get('host')}/ImageUpload/${supportCompany.logo}` : null;
    const response = {
      ...supportCompany.toJSON(),
      logo: logoUrl,
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching support company by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// Create or update support company
exports.createOrUpdateSupportCompany = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.single('logo'),
    async (req, res) => {
      try {
        const { id, name, nameLA, description, descriptionLA, supportAmount } = req.body;
        const logo = req.file ? path.join(folder, req.file.filename) : null;

        let supportCompany;
        if (id) {
          supportCompany = await SupportCompany.findByPk(id);
          if (supportCompany) {
            if (logo) {
              // Delete old logo if exists
              if (supportCompany.logo) {
                const oldLogoPath = path.join(__dirname, '..', 'ImageUpload', supportCompany.logo);
                if (fs.existsSync(oldLogoPath)) {
                  fs.unlinkSync(oldLogoPath);
                }
              }
              supportCompany.logo = logo;
            }
            supportCompany.name = name;
            supportCompany.nameLA = nameLA;
            supportCompany.description = description;
            supportCompany.descriptionLA = descriptionLA;
            supportCompany.supportAmount = supportAmount;
            await supportCompany.save();
          } else {
            supportCompany = await SupportCompany.create({ 
              name, 
              nameLA, 
              description, 
              descriptionLA, 
              supportAmount, 
              logo 
            });
          }
        } else {
          supportCompany = await SupportCompany.create({ 
            name, 
            nameLA, 
            description, 
            descriptionLA, 
            supportAmount, 
            logo 
          });
        }
        res.status(200).json(supportCompany);
      } catch (err) {
        console.error('Error creating or updating support company:', err);
        res.status(500).json({ error: err.message });
      }
    },
  ];
};

// Delete support company
exports.deleteSupportCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const supportCompany = await SupportCompany.findByPk(id);
    
    if (supportCompany) {
      // Delete logo file if exists
      if (supportCompany.logo) {
        const logoPath = path.join(__dirname, '..', 'ImageUpload', supportCompany.logo);
        if (fs.existsSync(logoPath)) {
          fs.unlinkSync(logoPath);
        }
      }
      
      await supportCompany.destroy();
      res.status(204).send('Support company deleted');
    } else {
      throw new Error('Support company not found');
    }
  } catch (err) {
    console.error('Error deleting support company:', err);
    res.status(500).json({ error: err.message });
  }
};
