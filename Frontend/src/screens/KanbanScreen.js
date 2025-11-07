import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, DEFAULT_CATEGORY } from '../constants';
import CategoryColumn from '../components/CategoryColumn';
import CategoryModal from '../components/CategoryModal';
import { getProducts, updateProduct, deleteProduct } from '../api/products';
import { getCategories, createCategory } from '../api/categories';

const KanbanScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([DEFAULT_CATEGORY]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Refresh data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      if (productsResponse.success) {
        setProducts(productsResponse.data || []);
      } else {
        Alert.alert('Error', productsResponse.message || 'Failed to load products');
        setProducts([]);
      }

      if (categoriesResponse.success) {
        const loadedCategories = categoriesResponse.data || [DEFAULT_CATEGORY];
        setCategories(loadedCategories.length > 0 ? loadedCategories : [DEFAULT_CATEGORY]);
      } else {
        Alert.alert('Error', categoriesResponse.message || 'Failed to load categories');
        setCategories([DEFAULT_CATEGORY]);
      }
    } catch (error) {
      console.error('Load data error:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (category) => {
    return products.filter(p => (p.category || DEFAULT_CATEGORY) === category);
  };

  const handleProductPress = (product) => {
    // Show product details or edit
    Alert.alert(
      product.name || 'Product',
      `Barcode: ${product.barcode || 'N/A'}\nPrice: $${product.price || '0.00'}\nCategory: ${product.category || DEFAULT_CATEGORY}`,
      [{ text: 'OK' }]
    );
  };

  const handleProductLongPress = (product) => {
    setSelectedProduct(product);
    // Show options to move or delete
    Alert.alert(
      'Product Options',
      'Choose an action',
      [
        {
          text: 'Move to Category',
          onPress: () => showCategorySelector(product),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteProduct(product),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const showCategorySelector = (product) => {
    const categoryOptions = categories.map(cat => ({
      text: cat,
      onPress: () => handleMoveProduct(product, cat),
    }));

    Alert.alert('Move to Category', 'Select a category', [
      ...categoryOptions,
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleMoveProduct = async (product, newCategory) => {
    try {
      const productId = product.id || product._id;
      const response = await updateProduct(productId, {
        category: newCategory,
      });

      if (response.success) {
        // Update local state
        const updatedProducts = products.map(p =>
          (p.id === product.id || p._id === product._id || p.barcode === product.barcode)
            ? { ...p, category: newCategory }
            : p
        );
        setProducts(updatedProducts);
      } else {
        Alert.alert('Error', response.message || 'Failed to move product');
      }
    } catch (error) {
      console.error('Move product error:', error);
      Alert.alert('Error', 'Failed to move product. Please try again.');
    }
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const productId = product.id || product._id;
              const response = await deleteProduct(productId);

              if (response.success) {
                // Update local state
                const updatedProducts = products.filter(
                  p => (p.id !== product.id && p._id !== product._id) && p.barcode !== product.barcode
                );
                setProducts(updatedProducts);
              } else {
                Alert.alert('Error', response.message || 'Failed to delete product');
              }
            } catch (error) {
              console.error('Delete product error:', error);
              Alert.alert('Error', 'Failed to delete product. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleCreateCategory = async (categoryName) => {
    if (!categoryName || !categoryName.trim()) {
      Alert.alert('Error', 'Category name cannot be empty');
      return;
    }

    if (categories.includes(categoryName)) {
      Alert.alert('Error', 'Category already exists');
      return;
    }

    try {
      const response = await createCategory(categoryName);

      if (response.success) {
        // Reload categories to get the updated list
        const categoriesResponse = await getCategories();
        if (categoriesResponse.success) {
          const updatedCategories = categoriesResponse.data || [DEFAULT_CATEGORY];
          setCategories(updatedCategories.length > 0 ? updatedCategories : [DEFAULT_CATEGORY]);
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Create category error:', error);
      Alert.alert('Error', 'Failed to create category. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading inventory...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Inventory Board</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={styles.addButtonText}>Category</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
        style={styles.scrollView}
      >
        {categories.map((category, index) => (
          <CategoryColumn
            key={category}
            category={category}
            products={getProductsByCategory(category)}
            onProductPress={handleProductPress}
            onProductLongPress={handleProductLongPress}
            onAddCategory={() => setCategoryModalVisible(true)}
            isUncategorized={category === DEFAULT_CATEGORY}
          />
        ))}
      </ScrollView>

      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSave={handleCreateCategory}
        existingCategories={categories}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
  },
  addButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.padding,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
  },
});

export default KanbanScreen;

