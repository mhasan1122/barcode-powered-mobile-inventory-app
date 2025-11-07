import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api/products';

const SearchScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
    
    // Refresh data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadProducts();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Use debounced search - search on backend if query is long enough
    if (searchQuery.trim().length >= 2) {
      searchProducts(searchQuery);
    } else if (searchQuery.trim().length === 0) {
      // If search is cleared, load all products
      loadProducts();
    } else {
      // For single character, filter locally
      filterProductsLocally();
    }
  }, [searchQuery]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts();
      if (response.success) {
        const loadedProducts = response.data || [];
        setProducts(loadedProducts);
        setFilteredProducts(loadedProducts);
      } else {
        console.error('Failed to load products:', response.message);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Load products error:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    setLoading(true);
    try {
      const response = await getProducts({ search: query });
      if (response.success) {
        setFilteredProducts(response.data || []);
      } else {
        // Fallback to local filtering
        filterProductsLocally();
      }
    } catch (error) {
      console.error('Search products error:', error);
      // Fallback to local filtering
      filterProductsLocally();
    } finally {
      setLoading(false);
    }
  };

  const filterProductsLocally = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product => {
      const name = (product.name || product.productName || '').toLowerCase();
      const barcode = (product.barcode || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      const description = (product.description || '').toLowerCase();

      return (
        name.includes(query) ||
        barcode.includes(query) ||
        category.includes(query) ||
        description.includes(query)
      );
    });

    setFilteredProducts(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleProductPress = (product) => {
    // Navigate to product details or show modal
    navigation.navigate('Kanban');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Search Products</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Search by name, barcode, or category..."
        />
      </View>

      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.emptyText}>
            {searchQuery ? 'Searching...' : 'Loading products...'}
          </Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name={searchQuery ? "search-outline" : "cube-outline"}
            size={64}
            color={COLORS.textLight}
          />
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No products found'
              : 'No products in inventory'}
          </Text>
          {!searchQuery && (
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate('Scanner')}
            >
              <Ionicons name="barcode-outline" size={20} color={COLORS.surface} />
              <Text style={styles.scanButtonText}>Scan Your First Product</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) => item.id || item._id || item.barcode || `search-product-${index}`}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item)}
            />
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom }]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {searchQuery && (
        <View style={[styles.resultsInfo, { paddingBottom: insets.bottom }]}>
          <Text style={styles.resultsText}>
            {`${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} found`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.text,
  },
  searchContainer: {
    padding: SIZES.padding,
  },
  listContent: {
    padding: SIZES.padding,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    marginTop: 24,
    ...SHADOWS.small,
  },
  scanButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.surface,
    marginLeft: 8,
  },
  resultsInfo: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resultsText: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default SearchScreen;

