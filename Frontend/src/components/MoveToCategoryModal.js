import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';
import { getCategoryColor } from '../utils/helpers';

const MoveToCategoryModal = ({ visible, categories = [], selectedCategory, onClose, onSelectCategory, productCount = 1 }) => {
  const [expanded, setExpanded] = useState(false);
  const [tempSelectedCategory, setTempSelectedCategory] = useState(selectedCategory);

  // Update temp selected category when prop changes
  useEffect(() => {
    setTempSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  const handleSelectCategory = (category) => {
    setTempSelectedCategory(category);
    setExpanded(false);
  };

  const handleMove = () => {
    if (tempSelectedCategory) {
      onSelectCategory(tempSelectedCategory);
    }
  };

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
            <View style={styles.headerContent}>
              <Text style={styles.title}>Move to Category</Text>
              {productCount > 1 && (
                <Text style={styles.productCount}>
                  {productCount} products
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Select Category</Text>
            
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setExpanded(!expanded)}
              activeOpacity={0.7}
            >
              <View style={styles.dropdownContent}>
                {tempSelectedCategory ? (
                  <View style={styles.selectedCategory}>
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: getCategoryColor(tempSelectedCategory) },
                      ]}
                    />
                    <Text style={styles.selectedText}>{String(tempSelectedCategory)}</Text>
                  </View>
                ) : (
                  <Text style={styles.placeholderText}>Choose a category</Text>
                )}
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </View>
            </TouchableOpacity>

            {expanded && (
              <View style={styles.dropdownList}>
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {categories.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyText}>No categories available</Text>
                    </View>
                  ) : (
                    categories.map((category, index) => {
                      const categoryName = String(category || 'Uncategorized');
                      const categoryColor = getCategoryColor(categoryName);
                      const isSelected = categoryName === tempSelectedCategory;

                      return (
                        <TouchableOpacity
                          key={categoryName || `category-${index}`}
                          style={[
                            styles.categoryItem,
                            isSelected && styles.categoryItemSelected,
                          ]}
                          onPress={() => handleSelectCategory(categoryName)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.categoryItemContent}>
                            <View
                              style={[
                                styles.colorIndicator,
                                { backgroundColor: categoryColor },
                              ]}
                            />
                            <Text
                              style={[
                                styles.categoryItemText,
                                isSelected && styles.categoryItemTextSelected,
                              ]}
                            >
                              {categoryName}
                            </Text>
                          </View>
                          {isSelected && (
                            <Ionicons
                              name="checkmark-circle"
                              size={20}
                              color={COLORS.primary}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                !tempSelectedCategory && styles.buttonDisabled,
              ]}
              onPress={() => {
                handleMove();
                onClose();
              }}
              disabled={!tempSelectedCategory}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>
                {productCount > 1 ? `Move ${productCount}` : 'Move'}
              </Text>
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
    maxHeight: '70%',
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
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
  },
  productCount: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    marginBottom: SIZES.margin,
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  dropdown: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  placeholderText: {
    fontSize: SIZES.body,
    color: COLORS.textLight,
    flex: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dropdownList: {
    marginTop: 8,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxHeight: 200,
    ...SHADOWS.small,
  },
  scrollView: {
    maxHeight: 200,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primaryLight + '10',
  },
  categoryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryItemText: {
    fontSize: SIZES.body,
    color: COLORS.text,
    marginLeft: 12,
  },
  categoryItemTextSelected: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyState: {
    padding: SIZES.padding,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.caption,
    color: COLORS.textLight,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  button: {
    flex: 1,
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.border,
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.surface,
  },
});

export default MoveToCategoryModal;

