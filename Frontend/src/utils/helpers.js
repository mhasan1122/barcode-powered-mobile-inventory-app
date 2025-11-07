import { COLORS, CATEGORY_COLORS } from '../constants';

/**
 * Get a color for a category based on its name
 */
export const getCategoryColor = (categoryName, index = 0) => {
  const name = String(categoryName || 'Uncategorized');
  if (name === 'Uncategorized') {
    return COLORS.uncategorized;
  }
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Validate barcode format
 */
export const isValidBarcode = (barcode) => {
  if (!barcode) return false;
  // Basic validation - can be enhanced based on barcode type
  return /^[0-9]{8,13}$/.test(barcode);
};

