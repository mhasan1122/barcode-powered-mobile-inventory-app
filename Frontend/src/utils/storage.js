import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PRODUCTS: '@inventory:products',
  CATEGORIES: '@inventory:categories',
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

