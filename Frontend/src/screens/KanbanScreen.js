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
import ProductOptionsModal from '../components/ProductOptionsModal';
import MoveToCategoryModal from '../components/MoveToCategoryModal';
import { getProducts, updateProduct, deleteProduct } from '../api/products';
import { getCategories, createCategory } from '../api/categories';

const KanbanScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([DEFAULT_CATEGORY]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [productOptionsModalVisible, setProductOptionsModalVisible] = useState(false);
  const [moveToCategoryModalVisible, setMoveToCategoryModalVisible] = useState(false);
  const [selectedCategoryForMove, setSelectedCategoryForMove] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draggingProduct, setDraggingProduct] = useState(null);
  const [dragOverCategory, setDragOverCategory] = useState(null);

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
        const loadedCategories = (categoriesResponse.data || [DEFAULT_CATEGORY])
          .map(cat => String(cat || DEFAULT_CATEGORY))
          .filter(cat => cat && cat.trim());
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
    const categoryName = String(category || DEFAULT_CATEGORY);
    return products.filter(p => String(p.category || DEFAULT_CATEGORY) === categoryName);
  };

  const handleProductPress = (product) => {
    if (selectionMode) {
      // Toggle selection
      setSelectedProducts(prev => {
        const isSelected = prev.some(p => 
          (p.id === product.id || p._id === product._id) && p.barcode === product.barcode
        );
        if (isSelected) {
          return prev.filter(p => 
            !((p.id === product.id || p._id === product._id) && p.barcode === product.barcode)
          );
        } else {
          return [...prev, product];
        }
      });
    } else {
      setSelectedProduct(product);
      setProductOptionsModalVisible(true);
    }
  };

  const handleProductLongPress = (product) => {
    if (!selectionMode) {
      // Enter selection mode and select this product
      setSelectionMode(true);
      setSelectedProducts([product]);
    }
  };

  const handleDragStart = (product, event) => {
    // Don't allow dragging in selection mode
    if (selectionMode) {
      console.log('Drag start blocked: selection mode active');
      return;
    }
    
    console.log('Drag start:', product.name, 'Category:', product.category);
    setDraggingProduct(product);
    setDragOverCategory(product.category || DEFAULT_CATEGORY);
  };

  const handleDragOver = (categoryName, layout) => {
    // Layout tracking for future enhancements
    // Currently using translation-based detection
  };

  const handleDragMove = (event) => {
    if (!draggingProduct) return;
    
    const { translationX } = event.nativeEvent;
    const currentCategory = draggingProduct.category || DEFAULT_CATEGORY;
    const currentIndex = categories.indexOf(currentCategory);
    
    // Determine target category based on drag direction and distance
    let targetCategory = null;
    const threshold = 60; // Minimum pixels to move before switching columns (reduced from 80)
    
    if (translationX > threshold && currentIndex < categories.length - 1) {
      // Dragging right - move to next category
      targetCategory = categories[currentIndex + 1];
    } else if (translationX < -threshold && currentIndex > 0) {
      // Dragging left - move to previous category
      targetCategory = categories[currentIndex - 1];
    } else {
      // Near original position - stay in current category
      targetCategory = currentCategory;
    }
    
    setDragOverCategory(targetCategory);
  };

  const handleDragEnd = async (event) => {
    if (!draggingProduct) {
      console.log('Drag end: No dragging product');
      return;
    }

    const currentCategory = draggingProduct.category || DEFAULT_CATEGORY;
    
    // Use the dragOverCategory that was tracked during drag, or fallback to translation-based detection
    let targetCategory = dragOverCategory;
    
    // If dragOverCategory is not set, calculate from translation as fallback
    if (!targetCategory || targetCategory === currentCategory) {
      // Note: event is already event.nativeEvent from ProductCard
      const { translationX } = event || {};
      const currentIndex = categories.indexOf(currentCategory);
      const threshold = 60; // Minimum pixels to move before switching columns
      
      if (translationX > threshold && currentIndex < categories.length - 1) {
        targetCategory = categories[currentIndex + 1];
      } else if (translationX < -threshold && currentIndex > 0) {
        targetCategory = categories[currentIndex - 1];
      } else {
        targetCategory = currentCategory;
      }
    }

    console.log('Drag end:', {
      currentCategory,
      targetCategory,
      dragOverCategory,
      translationX: event?.translationX,
      eventKeys: event ? Object.keys(event) : 'no event',
    });

    // If dropped on a different category, move the product
    if (targetCategory && targetCategory !== currentCategory) {
      try {
        const productId = draggingProduct.id || draggingProduct._id;
        console.log('Moving product to category:', targetCategory, 'Product ID:', productId);
        
        const response = await updateProduct(productId, {
          category: targetCategory,
        });

        console.log('Update product response:', response);

        if (response.success) {
          // Update local state immediately
          const updatedProducts = products.map(p => {
            const productIdMatch = (p.id === draggingProduct.id || p._id === draggingProduct._id) &&
                                  p.barcode === draggingProduct.barcode;
            return productIdMatch ? { ...p, category: targetCategory } : p;
          });
          
          setProducts(updatedProducts);
          console.log('Product moved successfully');
        } else {
          console.error('Failed to move product:', response.message);
          Alert.alert('Error', response.message || 'Failed to move product');
        }
      } catch (error) {
        console.error('Drag end error:', error);
        Alert.alert('Error', 'Failed to move product. Please try again.');
      }
    } else {
      console.log('Product not moved - same category or no target');
    }

    // Reset drag state
    setDraggingProduct(null);
    setDragOverCategory(null);
  };

  const handleMoveToCategory = () => {
    setProductOptionsModalVisible(false);
    setMoveToCategoryModalVisible(true);
    // Get the category from selected product or first selected product
    const productToCheck = selectedProduct || (selectedProducts.length > 0 ? selectedProducts[0] : null);
    setSelectedCategoryForMove(productToCheck?.category || null);
  };

  const handleBulkMoveToCategory = () => {
    if (selectedProducts.length === 0) return;
    setMoveToCategoryModalVisible(true);
    const firstProduct = selectedProducts[0];
    setSelectedCategoryForMove(firstProduct?.category || null);
  };

  const handleCategorySelect = async (newCategory) => {
    const productsToMove = selectedProduct 
      ? [selectedProduct] 
      : selectedProducts.length > 0 
        ? selectedProducts 
        : [];

    if (productsToMove.length === 0) {
      Alert.alert('Error', 'No products selected to move');
      return;
    }

    try {
      // Move all products
      const movePromises = productsToMove.map(product => {
        const productId = product.id || product._id;
        return updateProduct(productId, {
          category: newCategory,
        });
      });

      const responses = await Promise.all(movePromises);
      const allSuccess = responses.every(r => r.success);

      if (allSuccess) {
        // Update local state
        const productIds = productsToMove.map(p => p.id || p._id);
        const productBarcodes = productsToMove.map(p => p.barcode);
        
        const updatedProducts = products.map(p => {
          const shouldUpdate = productIds.includes(p.id || p._id) || 
                              productBarcodes.includes(p.barcode);
          return shouldUpdate ? { ...p, category: newCategory } : p;
        });
        
        setProducts(updatedProducts);
        setSelectedProduct(null);
        setSelectedProducts([]);
        setSelectedCategoryForMove(null);
        setSelectionMode(false);
        setMoveToCategoryModalVisible(false);
        
        const count = productsToMove.length;
        Alert.alert(
          'Success', 
          `${count} product${count > 1 ? 's' : ''} moved successfully`,
          [{ text: 'OK' }]
        );
      } else {
        const failedCount = responses.filter(r => !r.success).length;
        Alert.alert('Error', `Failed to move ${failedCount} product${failedCount > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Move product error:', error);
      Alert.alert('Error', 'Failed to move products. Please try again.');
    }
  };

  const handleDeleteProduct = (product) => {
    const productName = product.name || product.productName || 'this product';
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"?`,
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
                  p => !((p.id === product.id || p._id === product._id) && p.barcode === product.barcode)
                );
                setProducts(updatedProducts);
                setSelectedProduct(null);
                setProductOptionsModalVisible(false);
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

  const handleBulkDeleteProducts = () => {
    if (selectedProducts.length === 0) return;

    const count = selectedProducts.length;
    Alert.alert(
      'Delete Products',
      `Are you sure you want to delete ${count} product${count > 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete all selected products
              const deletePromises = selectedProducts.map(product => {
                const productId = product.id || product._id;
                return deleteProduct(productId);
              });

              const responses = await Promise.all(deletePromises);
              const successCount = responses.filter(r => r.success).length;
              const failedCount = responses.filter(r => !r.success).length;

              if (successCount > 0) {
                // Update local state - remove successfully deleted products
                const deletedProductIds = selectedProducts
                  .filter((_, index) => responses[index].success)
                  .map(p => p.id || p._id);
                const deletedProductBarcodes = selectedProducts
                  .filter((_, index) => responses[index].success)
                  .map(p => p.barcode);

                const updatedProducts = products.filter(p => {
                  const shouldRemove = deletedProductIds.includes(p.id || p._id) || 
                                      deletedProductBarcodes.includes(p.barcode);
                  return !shouldRemove;
                });

                setProducts(updatedProducts);
                setSelectedProducts([]);
                setSelectionMode(false);

                if (failedCount > 0) {
                  Alert.alert(
                    'Partial Success',
                    `${successCount} product${successCount > 1 ? 's' : ''} deleted. ${failedCount} failed.`
                  );
                } else {
                  Alert.alert(
                    'Success',
                    `${successCount} product${successCount > 1 ? 's' : ''} deleted successfully`,
                    [{ text: 'OK' }]
                  );
                }
              } else {
                Alert.alert('Error', 'Failed to delete products. Please try again.');
              }
            } catch (error) {
              console.error('Bulk delete error:', error);
              Alert.alert('Error', 'Failed to delete products. Please try again.');
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
          const updatedCategories = (categoriesResponse.data || [DEFAULT_CATEGORY])
            .map(cat => String(cat || DEFAULT_CATEGORY))
            .filter(cat => cat && cat.trim());
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

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedProducts([]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        {selectionMode ? (
          <>
            <View style={styles.selectionHeader}>
              <TouchableOpacity
                style={styles.cancelSelectionButton}
                onPress={exitSelectionMode}
              >
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.selectionTitle}>
                {selectedProducts.length} selected
              </Text>
            </View>
            <View style={styles.selectionActions}>
              {selectedProducts.length > 0 && (
                <>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleBulkDeleteProducts}
                  >
                    <Ionicons name="trash-outline" size={20} color={COLORS.error} />
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.moveButton}
                    onPress={handleBulkMoveToCategory}
                  >
                    <Ionicons name="move-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.moveButtonText}>Move</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.title}>Inventory Board</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Ionicons name="add-circle" size={24} color={COLORS.primary} />
              <Text style={styles.addButtonText}>Category</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom }]}
        style={styles.scrollView}
      >
        {categories.map((category, index) => {
          const categoryName = String(category || DEFAULT_CATEGORY);
          return (
            <CategoryColumn
              key={categoryName || `category-${index}`}
              category={categoryName}
              products={getProductsByCategory(categoryName)}
              onProductPress={handleProductPress}
              onProductLongPress={handleProductLongPress}
              onAddCategory={() => setCategoryModalVisible(true)}
              isUncategorized={categoryName === DEFAULT_CATEGORY}
              selectionMode={selectionMode}
              selectedProducts={selectedProducts}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragMove={handleDragMove}
              onDragOver={handleDragOver}
              isDragOver={dragOverCategory === categoryName}
              draggingProduct={draggingProduct}
            />
          );
        })}
      </ScrollView>

      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSave={handleCreateCategory}
        existingCategories={categories}
      />

      <ProductOptionsModal
        visible={productOptionsModalVisible}
        product={selectedProduct}
        onClose={() => {
          setProductOptionsModalVisible(false);
          setSelectedProduct(null);
        }}
        onMoveToCategory={handleMoveToCategory}
        onDelete={() => {
          if (selectedProduct) {
            handleDeleteProduct(selectedProduct);
          }
        }}
      />

      <MoveToCategoryModal
        visible={moveToCategoryModalVisible}
        categories={categories}
        selectedCategory={selectedCategoryForMove}
        productCount={selectedProduct ? 1 : selectedProducts.length}
        onClose={() => {
          setMoveToCategoryModalVisible(false);
          setSelectedCategoryForMove(null);
        }}
        onSelectCategory={handleCategorySelect}
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
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cancelSelectionButton: {
    padding: 4,
    marginRight: 12,
  },
  selectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
  },
  moveButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radius,
    marginRight: 8,
  },
  deleteButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 4,
  },
});

export default KanbanScreen;

