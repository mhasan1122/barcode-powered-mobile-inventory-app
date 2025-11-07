import apiClient from './client';

/**
 * Products API endpoints
 */

/**
 * Create a new product
 * @param {Object} productData - Product data (barcode, name, price, description, category)
 * @returns {Promise<Object>} Response with product data
 */
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post('/api/products', productData);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Product created successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to create product',
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to create product. Please try again.',
    };
  }
};

/**
 * Get all products
 * @param {Object} filters - Optional filters (category, search)
 * @returns {Promise<Object>} Response with products array
 */
export const getProducts = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);

    const endpoint = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(endpoint);

    if (response.success) {
      return {
        success: true,
        data: response.data || [],
        message: response.message || 'Products retrieved successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to retrieve products',
      data: [],
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to retrieve products. Please try again.',
      data: [],
    };
  }
};

/**
 * Get a single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Response with product data
 */
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/api/products/${productId}`);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Product retrieved successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Product not found',
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to retrieve product. Please try again.',
    };
  }
};

/**
 * Get a product by barcode
 * @param {string} barcode - Product barcode
 * @returns {Promise<Object>} Response with product data
 */
export const getProductByBarcode = async (barcode) => {
  try {
    const response = await apiClient.get(`/api/products/barcode/${barcode}`);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Product retrieved successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Product not found',
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to retrieve product. Please try again.',
    };
  }
};

/**
 * Update a product
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} Response with updated product data
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await apiClient.put(`/api/products/${productId}`, productData);

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Product updated successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to update product',
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to update product. Please try again.',
    };
  }
};

/**
 * Delete a product
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Response with success status
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/api/products/${productId}`);

    if (response.success) {
      return {
        success: true,
        message: response.message || 'Product deleted successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to delete product',
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to delete product. Please try again.',
    };
  }
};

/**
 * Get product statistics/analytics
 * @returns {Promise<Object>} Response with statistics data
 */
export const getProductStats = async () => {
  try {
    const response = await apiClient.get('/api/products/stats/analytics');

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Statistics retrieved successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to retrieve statistics',
      data: {
        totalProducts: 0,
        categoryCounts: {},
        recentProducts: [],
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to retrieve statistics. Please try again.',
      data: {
        totalProducts: 0,
        categoryCounts: {},
        recentProducts: [],
      },
    };
  }
};

