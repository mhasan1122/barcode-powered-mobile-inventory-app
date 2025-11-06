import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/storage';

const SearchScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const loadProducts = async () => {
    const loadedProducts = await getProducts();
    setProducts(loadedProducts);
    setFilteredProducts(loadedProducts);
  };

  const filterProducts = () => {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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

      {filteredProducts.length === 0 ? (
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
          keyExtractor={(item, index) => item.id || item.barcode || index.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {searchQuery && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}
    </SafeAreaView>
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

