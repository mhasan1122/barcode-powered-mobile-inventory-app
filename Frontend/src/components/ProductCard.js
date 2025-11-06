import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';
import { truncateText, formatDate } from '../utils/helpers';

const ProductCard = ({ product, onPress, onLongPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {product.image ? (
        <Image source={{ uri: product.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="cube-outline" size={32} color={COLORS.textLight} />
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name || product.productName || 'Unknown Product'}
        </Text>
        
        {product.barcode && (
          <View style={styles.barcodeContainer}>
            <Ionicons name="barcode-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.barcode}>{product.barcode}</Text>
          </View>
        )}
        
        {product.price && (
          <Text style={styles.price}>
            ${parseFloat(product.price).toFixed(2)}
          </Text>
        )}
        
        {product.description && (
          <Text style={styles.description} numberOfLines={2}>
            {truncateText(product.description, 60)}
          </Text>
        )}
        
        {product.createdAt && (
          <Text style={styles.date}>{formatDate(product.createdAt)}</Text>
        )}
      </View>
      
      <View style={styles.dragHandle}>
        <Ionicons name="reorder-three-outline" size={20} color={COLORS.textLight} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: 12,
    flexDirection: 'row',
    ...SHADOWS.small,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.border,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  barcode: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontFamily: 'monospace',
  },
  price: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  description: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  date: {
    fontSize: SIZES.small,
    color: COLORS.textLight,
    marginTop: 4,
  },
  dragHandle: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
});

export default ProductCard;

