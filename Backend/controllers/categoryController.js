const Category = require('../models/Category');
const Product = require('../models/Product');

/**
 * Create a new category
 * POST /api/categories
 */
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({
      user: userId,
      name: name.trim(),
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
        data: existingCategory,
      });
    }

    // Create category
    const category = new Category({
      user: userId,
      name: name.trim(),
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get all categories for the authenticated user
 * GET /api/categories
 */
const getCategories = async (req, res) => {
  try {
    const userId = req.userId;

    const categories = await Category.find({ user: userId }).sort({ name: 1 });

    // Always include 'Uncategorized' as a default category
    const categoryNames = categories.map((cat) => cat.name);
    
    if (!categoryNames.includes('Uncategorized')) {
      categoryNames.unshift('Uncategorized');
    }

    res.json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categoryNames,
      count: categoryNames.length,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Delete a category
 * DELETE /api/categories/:name
 */
const deleteCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const userId = req.userId;

    // Prevent deletion of 'Uncategorized'
    if (name === 'Uncategorized') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the default category',
      });
    }

    // Find and delete category
    const category = await Category.findOneAndDelete({
      user: userId,
      name: name.trim(),
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Move all products in this category to 'Uncategorized'
    await Product.updateMany(
      { user: userId, category: name.trim() },
      { category: 'Uncategorized' }
    );

    res.json({
      success: true,
      message: 'Category deleted successfully. Products moved to Uncategorized.',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};

