import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PRODUCTS: '@inventory:products',
  CATEGORIES: '@inventory:categories',
  AUTH_TOKEN: '@inventory:auth_token',
  USER_DATA: '@inventory:user_data',
  IS_AUTHENTICATED: '@inventory:is_authenticated',
  REGISTERED_USERS: '@inventory:registered_users',
};

/**
 * Save products to local storage
 */
export const saveProducts = async (products) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};

/**
 * Get products from local storage
 */
export const getProducts = async () => {
  try {
    const products = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
};

/**
 * Save categories to local storage
 */
export const saveCategories = async (categories) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  } catch (error) {
    console.error('Error saving categories:', error);
    return false;
  }
};

/**
 * Get categories from local storage
 */
export const getCategories = async () => {
  try {
    const categories = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : ['Uncategorized'];
  } catch (error) {
    console.error('Error getting categories:', error);
    return ['Uncategorized'];
  }
};

/**
 * Save authentication token
 */
export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  } catch (error) {
    console.error('Error saving auth token:', error);
    return false;
  }
};

/**
 * Get authentication token
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Save user data
 */
export const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * Get user data
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Set authentication status
 */
export const setAuthenticated = async (isAuthenticated) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.IS_AUTHENTICATED,
      JSON.stringify(isAuthenticated)
    );
    return true;
  } catch (error) {
    console.error('Error setting authentication status:', error);
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async () => {
  try {
    const authStatus = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
    return authStatus ? JSON.parse(authStatus) : false;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

/**
 * Clear authentication data (logout)
 */
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.IS_AUTHENTICATED,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

/**
 * Save registered user
 */
export const saveRegisteredUser = async (userData) => {
  try {
    const existingUsers = await getRegisteredUsers();
    const updatedUsers = [...existingUsers, userData];
    await AsyncStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    console.error('Error saving registered user:', error);
    return false;
  }
};

/**
 * Get all registered users
 */
export const getRegisteredUsers = async () => {
  try {
    const users = await AsyncStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting registered users:', error);
    return [];
  }
};

/**
 * Find user by username and password (for login) - Legacy function
 */
export const findUserByCredentials = async (username, password) => {
  try {
    const users = await getRegisteredUsers();
    return users.find(
      (user) =>
        user.username.toLowerCase() === username.toLowerCase() &&
        user.password === password
    );
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

/**
 * Find user by email and password (for login)
 */
export const findUserByEmailAndPassword = async (email, password) => {
  try {
    const users = await getRegisteredUsers();
    return users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
};

