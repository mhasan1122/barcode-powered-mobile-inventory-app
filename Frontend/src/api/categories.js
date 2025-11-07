import apiClient from './client';

/**
 * Categories API endpoints
 */

/**
 * Create a new category
 * @param {string} categoryName - Category name
 * @returns {Promise<Object>} Response with category data
 */
export const createCategory = async (categoryName) => {
  try {
    const response = await apiClient.post('/api/categories', {
      name: categoryName,
    });

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Category created successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to create category',
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to create category. Please try again.',
    };
  }
};

/**
 * Get all categories
 * @returns {Promise<Object>} Response with categories array
 */
export const getCategories = async () => {
  try {
    const response = await apiClient.get('/api/categories');

    if (response.success) {
      // Ensure 'Uncategorized' is always included
      const categories = response.data || [];
      if (!categories.includes('Uncategorized')) {
        categories.unshift('Uncategorized');
      }

      return {
        success: true,
        data: categories,
        message: response.message || 'Categories retrieved successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to retrieve categories',
      data: ['Uncategorized'],
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to retrieve categories. Please try again.',
      data: ['Uncategorized'],
    };
  }
};

/**
 * Delete a category
 * @param {string} categoryName - Category name
 * @returns {Promise<Object>} Response with success status
 */
export const deleteCategory = async (categoryName) => {
  try {
    const response = await apiClient.delete(`/api/categories/${encodeURIComponent(categoryName)}`);

    if (response.success) {
      return {
        success: true,
        message: response.message || 'Category deleted successfully',
      };
    }

    return {
      success: false,
      message: response.message || 'Failed to delete category',
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to delete category. Please try again.',
    };
  }
};

