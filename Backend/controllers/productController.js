const Product = require('../models/Product');

/**
 * Create a new product
 * POST /api/products
 */
const createProduct = async (req, res) => {
  try {
    const { barcode, name, price, description, category } = req.body;
    const userId = req.userId;

    // Check if product with same barcode already exists for this user
    const existingProduct = await Product.findOne({
      user: userId,
      barcode: barcode.trim(),
    });

    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this barcode already exists',
        data: existingProduct,
      });
    }

    // Create product
    const product = new Product({
      user: userId,
      barcode: barcode.trim(),
      name: name.trim(),
      price: price || 0,
      description: description ? description.trim() : '',
      category: category ? category.trim() : 'Uncategorized',
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product with this barcode already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get all products for the authenticated user
 * GET /api/products
 */
const getProducts = async (req, res) => {
  try {
    const userId = req.userId;
    const { category, search } = req.query;

    // Build query
    const query = { user: userId };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get a single product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const product = await Product.findOne({ _id: id, user: userId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get a product by barcode
 * GET /api/products/barcode/:barcode
 */
const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;
    const userId = req.userId;

    const product = await Product.findOne({
      user: userId,
      barcode: barcode.trim(),
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    console.error('Get product by barcode error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Update a product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name, price, description, category } = req.body;

    // Find product
    const product = await Product.findOne({ _id: id, user: userId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update fields
    if (name !== undefined) product.name = name.trim();
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description.trim();
    if (category !== undefined) product.category = category.trim();

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Delete a product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const product = await Product.findOneAndDelete({ _id: id, user: userId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get product statistics
 * GET /api/products/stats/analytics
 */
const getProductStats = async (req, res) => {
  try {
    const userId = req.userId;

    const products = await Product.find({ user: userId });

    // Calculate statistics
    const totalProducts = products.length;
    const categoryCounts = {};
    const recentProducts = products
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map((p) => ({
        id: p._id,
        barcode: p.barcode,
        name: p.name,
        category: p.category || 'Uncategorized',
        createdAt: p.createdAt,
      }));

    products.forEach((product) => {
      const category = product.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    res.json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: {
        totalProducts,
        categoryCounts,
        recentProducts,
      },
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductByBarcode,
  updateProduct,
  deleteProduct,
  getProductStats,
};

