const Product = require('../models/productModel');
const ProductCategory = require('../models/productCategoryModel');
const path = require('path');
const createImageUpload = require('../configs/multerConfig');
const jwt = require('jsonwebtoken');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{
        model: ProductCategory,
        as: 'category'
      }]
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ 
      where: { product_id: id },
      include: [{
        model: ProductCategory,
        as: 'category'
      }]
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.fields([
      { name: 'coverImage', maxCount: 1 }, 
      { name: 'subImages', maxCount: 10 }
    ]),
    async (req, res) => {
      try {
        const {
          name_en,
          name_lo,
          price,
          originalPrice,
          discount,
          description_en,
          description_lo,
          location_en,
          location_lo,
          shippingFee,
          available,
          category_id
        } = req.body;

        if (!name_en || !name_lo || !price || !category_id) {
          return res.status(400).json({ error: 'Required fields are missing' });
        }

        const coverImage = req.files['coverImage'] ? 
          path.join(folder, req.files['coverImage'][0].filename) : null;
        const subImages = req.files['subImages'] ? 
          req.files['subImages'].map(file => path.join(folder, file.filename)) : [];

        const product = await Product.create({
          name_en,
          name_lo,
          price,
          originalPrice,
          discount,
          description_en,
          description_lo,
          location_en,
          location_lo,
          shippingFee,
          available,
          category_id,
          coverImage,
          subImages
        });

        res.status(201).json(product);
      } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: err.message });
      }
    }
  ];
};

exports.updateProduct = (folder) => {
  const imageUpload = createImageUpload(folder);
  return [
    imageUpload.fields([
      { name: 'coverImage', maxCount: 1 }, 
      { name: 'subImages', maxCount: 10 }
    ]),
    async (req, res) => {
      try {
        const { id } = req.params;
        const product = await Product.findOne({ where: { product_id: id } });

        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        let finalSubImages = [];
        
        if (req.body.existingSubImages) {
          try {
            finalSubImages = JSON.parse(req.body.existingSubImages);
          } catch (error) {
            console.error('Error parsing existingSubImages:', error);
          }
        }

        if (req.files && req.files['subImages']) {
          const newSubImages = req.files['subImages'].map(file => 
            path.join(folder, file.filename)
          );
          finalSubImages = [...finalSubImages, ...newSubImages];
        }

        const updateData = {
          ...req.body,
          subImages: finalSubImages
        };

        if (req.files && req.files['coverImage']) {
          updateData.coverImage = path.join(folder, req.files['coverImage'][0].filename);
        }

        delete updateData.existingSubImages;

        await product.update(updateData);
        
        const updatedProduct = await Product.findOne({ 
          where: { product_id: id },
          include: [{
            model: ProductCategory,
            as: 'category'
          }]
        });
        
        res.json(updatedProduct);
      } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ error: err.message });
      }
    }
  ];
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({
      where: { product_id: id }
    });
    
    if (deleted) {
      res.status(204).send("Product deleted");
    } else {
      throw new Error("Product not found");
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: err.message });
  }
}; 