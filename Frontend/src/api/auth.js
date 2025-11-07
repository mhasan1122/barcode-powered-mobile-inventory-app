import apiClient from './client';

/**
 * Authentication API endpoints
 */

/**
 * Register a new user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} Response with user data and token
 */
export const register = async (username, password) => {
  try {
    console.log('📝 Registering user:', { username });
    
    const response = await apiClient.post('/api/auth/register', {
      username,
      password,
    });

    if (response.success) {
      console.log('✅ Registration successful');
      return {
        success: true,
        data: response.data,
        message: response.message || 'Registration successful',
      };
    }

    console.error('❌ Registration failed:', response.message);
    return {
      success: false,
      message: response.message || 'Registration failed',
      status: response.status,
    };
  } catch (error) {
    console.error('❌ Registration API error:', error);
    return {
      success: false,
      message: error.message || 'Registration failed. Please try again.',
    };
  }
};

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} Response with user data and token
 */
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/api/auth/login', {
      username,
      password,
    });

    if (response.success) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Login successful',
      };
    }

    return {
      success: false,
      message: response.message || 'Login failed',
    };
  } catch (error) {
    // Error is already handled and displayed in UI, no need to log client errors
    return {
      success: false,
      message: error.message || 'Login failed. Please try again.',
    };
  }
};

