const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  getProductByBarcode,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

// All product routes require authentication
router.use(authenticate);

// Create a new product
router.post('/', validateProduct, createProduct);

// Get all products (with optional query params: category, search)
router.get('/', getProducts);

// Get product statistics
router.get('/stats/analytics', getProductStats);

// Get product by barcode
router.get('/barcode/:barcode', getProductByBarcode);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product
router.put('/:id', updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

module.exports = router;

