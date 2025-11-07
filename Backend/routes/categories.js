const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const { validateCategory } = require('../middleware/validation');

// All category routes require authentication
router.use(authenticate);

// Create a new category
router.post('/', validateCategory, createCategory);

// Get all categories
router.get('/', getCategories);

// Delete a category
router.delete('/:name', deleteCategory);

module.exports = router;

