import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';
import { getCategoryColor } from '../utils/helpers';
import ProductCard from './ProductCard';

const CategoryColumn = ({
  category,
  products,
  onProductPress,
  onProductLongPress,
  onAddCategory,
  isUncategorized = false,
}) => {
  const categoryColor = getCategoryColor(category);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderLeftColor: categoryColor }]}>
        <View style={styles.headerContent}>
          <View style={[styles.colorIndicator, { backgroundColor: categoryColor }]} />
          <Text style={styles.categoryName}>{category}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{products.length}</Text>
          </View>
        </View>
        {isUncategorized && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={onAddCategory}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.productsContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No products</Text>
          </View>
        ) : (
          products.map((product, index) => (
            <ProductCard
              key={product.id || product.barcode || index}
              product={product}
              onPress={() => onProductPress && onProductPress(product)}
              onLongPress={() => onProductLongPress && onProductLongPress(product)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    marginRight: SIZES.margin,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  header: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    borderLeftWidth: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: SIZES.small,
    fontWeight: '700',
    color: COLORS.surface,
  },
  addButton: {
    padding: 4,
  },
  productsContainer: {
    flex: 1,
    padding: SIZES.padding,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: SIZES.caption,
    color: COLORS.textLight,
    marginTop: 8,
  },
});

export default CategoryColumn;

