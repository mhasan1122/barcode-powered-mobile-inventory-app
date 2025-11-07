import { getBackendURL, getAPITimeout } from './config';
import { getAuthToken } from '../utils/storage';

/**
 * API Client with error handling and token management
 */
class APIClient {
  constructor() {
    this.baseURL = getBackendURL();
    this.timeout = getAPITimeout();
  }

  /**
   * Get headers for API requests
   */
  async getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = await getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Make API request with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders();

    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

    try {
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), this.timeout);
      });

      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(url, config),
        timeoutPromise,
      ]);

      // Try to parse JSON response
      let data;
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Invalid response from server. Status: ${response.status}`);
      }

      // Handle error responses
      if (!response.ok) {
        const errorMessage = data.message || 
                           data.error || 
                           (data.errors && Array.isArray(data.errors) ? data.errors.map(e => e.msg || e.message).join(', ') : '') ||
                           `HTTP error! status: ${response.status}`;
        
        // Only log server errors (500+) to console, client errors (400-499) are handled in UI
        if (response.status >= 500) {
          console.error(`❌ API Error [${response.status}]:`, errorMessage, data);
        }
        
        return {
          success: false,
          message: errorMessage,
          status: response.status,
          data: data,
        };
      }

      console.log(`✅ API Success:`, data);
      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('❌ API request error:', error);
      console.error('Error details:', {
        url,
        method: options.method || 'GET',
        message: error.message,
      });

      // Handle specific error types
      let errorMessage = 'Network error. Please check your connection.';
      
      if (error.message === 'Request timeout') {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage,
        error: error.message,
      };
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

// Export singleton instance
export default new APIClient();

