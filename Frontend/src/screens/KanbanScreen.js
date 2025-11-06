import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, DEFAULT_CATEGORY } from '../constants';
import CategoryColumn from '../components/CategoryColumn';
import CategoryModal from '../components/CategoryModal';
import { getProducts, saveProducts, getCategories, saveCategories } from '../utils/storage';

const KanbanScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([DEFAULT_CATEGORY]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedProducts = await getProducts();
    const loadedCategories = await getCategories();
    setProducts(loadedProducts);
    setCategories(loadedCategories.length > 0 ? loadedCategories : [DEFAULT_CATEGORY]);
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

  const handleMoveProduct = (product, newCategory) => {
    const updatedProducts = products.map(p =>
      p.id === product.id || p.barcode === product.barcode
        ? { ...p, category: newCategory }
        : p
    );
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
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
          onPress: () => {
            const updatedProducts = products.filter(
              p => p.id !== product.id && p.barcode !== product.barcode
            );
            setProducts(updatedProducts);
            saveProducts(updatedProducts);
          },
        },
      ]
    );
  };

  const handleCreateCategory = (categoryName) => {
    if (!categories.includes(categoryName)) {
      const updatedCategories = [...categories, categoryName];
      setCategories(updatedCategories);
      saveCategories(updatedCategories);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
        contentContainerStyle={styles.scrollContent}
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
    </SafeAreaView>
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
});

export default KanbanScreen;

