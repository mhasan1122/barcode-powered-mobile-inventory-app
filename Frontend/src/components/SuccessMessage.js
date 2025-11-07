import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';

const SuccessMessage = ({ message, onClose, style }) => {
  if (!message) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Ionicons
          name="checkmark-circle"
          size={SIZES.iconSize}
          color={COLORS.success || '#10B981'}
          style={styles.icon}
        />
        <Text style={styles.message}>{message}</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={18} color={COLORS.success || '#10B981'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#D1FAE5',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: SIZES.margin / 2,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    ...SHADOWS.small,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: SIZES.padding / 2,
  },
  message: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.success || '#059669',
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: SIZES.padding / 2,
    padding: 4,
  },
});

export default SuccessMessage;

