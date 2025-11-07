import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';
import { truncateText, formatDate } from '../utils/helpers';

const ProductCard = ({ 
  product, 
  onPress, 
  onLongPress, 
  selectionMode = false, 
  isSelected = false,
  onDragStart,
  onDragEnd,
  onDragMove,
  isDragging = false,
  dragOpacity = 1,
}) => {
  const translateX = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  // Handle gesture event - update animated values and notify parent
  const handleGestureEvent = (event) => {
    const { translationX: tx, translationY: ty } = event.nativeEvent;
    
    // Update animated values (without native driver for manual control)
    translateX.setValue(tx);
    translateY.setValue(ty);
    
    // Notify parent of drag movement for drop zone detection
    if (onDragMove) {
      onDragMove(event);
    }
  };

  const handleHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      // Gesture ended
      if (onDragEnd) {
        onDragEnd(event.nativeEvent);
      }
      
      // Stop any running animations first
      translateX.stopAnimation();
      translateY.stopAnimation();
      scale.stopAnimation();
      opacity.stopAnimation();
      
      // Reset position - all use non-native driver to avoid conflicts
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }),
      ]).start();
    } else if (event.nativeEvent.state === State.BEGAN) {
      // Gesture started
      if (onDragStart) {
        onDragStart(product, event.nativeEvent);
      }
      
      // Stop any running animations first
      scale.stopAnimation();
      opacity.stopAnimation();
      
      // Scale up and reduce opacity - use non-native driver
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.05,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }),
        Animated.spring(opacity, {
          toValue: 0.8,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }),
      ]).start();
    }
  };

  const animatedStyle = {
    transform: [
      { translateX: translateX },
      { translateY: translateY },
      { scale: isDragging ? scale : 1 },
    ],
    opacity: isDragging ? opacity : dragOpacity,
    zIndex: isDragging ? 1000 : 1,
  };

  const cardContent = (
    <View
      style={[
        styles.card,
        selectionMode && styles.cardSelectionMode,
        isSelected && styles.cardSelected,
        isDragging && styles.cardDragging,
      ]}
    >
      {selectionMode && (
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color={COLORS.surface} />
          )}
        </View>
      )}
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
        
        {Boolean(product.barcode && String(product.barcode).trim()) && (
          <View style={styles.barcodeContainer}>
            <Ionicons name="barcode-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.barcode}>{String(product.barcode)}</Text>
          </View>
        )}
        
        {product.price != null && product.price !== '' && (
          <Text style={styles.price}>
            {`$${parseFloat(product.price || 0).toFixed(2)}`}
          </Text>
        )}
        
        {Boolean(product.description && String(product.description).trim()) && (
          <Text style={styles.description} numberOfLines={2}>
            {truncateText(String(product.description), 60)}
          </Text>
        )}
        
        {Boolean(product.createdAt) && (
          <Text style={styles.date}>{formatDate(product.createdAt)}</Text>
        )}
      </View>
      
      <View style={styles.dragHandle}>
        <Ionicons name="reorder-three-outline" size={20} color={COLORS.textLight} />
      </View>
    </View>
  );

  if (selectionMode) {
    // In selection mode, don't allow dragging
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  // Use PanGestureHandler for drag-and-drop
  return (
    <PanGestureHandler
      onGestureEvent={handleGestureEvent}
      onHandlerStateChange={handleHandlerStateChange}
      minPointers={1}
      activeOffsetX={[-5, 5]} // Reduced threshold to make dragging easier
      activeOffsetY={[-5, 5]} // Reduced threshold to make dragging easier
      failOffsetY={[-100, 100]} // Increased to allow more vertical movement
      avgTouches={true}
    >
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          onPress={onPress}
          onLongPress={onLongPress}
          activeOpacity={0.7}
          delayLongPress={200}
        >
          {cardContent}
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
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
  cardSelectionMode: {
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + '10',
  },
  cardDragging: {
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default ProductCard;

