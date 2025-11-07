import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';
import { formatDate } from '../utils/helpers';

const ProductOptionsModal = ({ visible, product, onClose, onMoveToCategory, onDelete }) => {
  if (!product) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Product Options</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.productInfo}>
            {product.image ? (
              <Image source={{ uri: product.image }} style={styles.productImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="cube-outline" size={48} color={COLORS.textLight} />
              </View>
            )}
            
            <View style={styles.productDetails}>
              <Text style={styles.productName} numberOfLines={2}>
                {product.name || product.productName || 'Unknown Product'}
              </Text>
              
              {Boolean(product.barcode && String(product.barcode).trim()) && (
                <View style={styles.detailRow}>
                  <Ionicons name="barcode-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{String(product.barcode)}</Text>
                </View>
              )}
              
              {product.price != null && product.price !== '' && (
                <View style={styles.detailRow}>
                  <Ionicons name="cash-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>
                    ${parseFloat(product.price || 0).toFixed(2)}
                  </Text>
                </View>
              )}
              
              {Boolean(product.category) && (
                <View style={styles.detailRow}>
                  <Ionicons name="folder-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{String(product.category)}</Text>
                </View>
              )}
              
              {Boolean(product.createdAt) && (
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailText}>{formatDate(product.createdAt)}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                onClose();
                onMoveToCategory();
              }}
              activeOpacity={0.7}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="move-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.optionText}>Move to Category</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.deleteButton]}
              onPress={() => {
                onClose();
                onDelete();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIconContainer, styles.deleteIconContainer]}>
                <Ionicons name="trash-outline" size={24} color={COLORS.error} />
              </View>
              <Text style={[styles.optionText, styles.deleteText]}>Delete Product</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SIZES.radiusLarge,
    borderTopRightRadius: SIZES.radiusLarge,
    padding: SIZES.padding,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.margin,
    paddingBottom: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  productInfo: {
    flexDirection: 'row',
    marginBottom: SIZES.margin,
    paddingBottom: SIZES.margin,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.border,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    marginLeft: SIZES.padding,
    justifyContent: 'center',
  },
  productName: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.small,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionText: {
    flex: 1,
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  deleteButton: {
    backgroundColor: COLORS.error + '10',
  },
  deleteIconContainer: {
    backgroundColor: COLORS.error + '20',
  },
  deleteText: {
    color: COLORS.error,
  },
});

export default ProductOptionsModal;

