import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';

const ErrorMessage = ({ message, onClose, style }) => {
  if (!message) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Ionicons
          name="alert-circle"
          size={SIZES.iconSize}
          color={COLORS.error || '#EF4444'}
          style={styles.icon}
        />
        <Text style={styles.message}>{message}</Text>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={18} color={COLORS.error || '#EF4444'} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginVertical: SIZES.margin / 2,
    borderWidth: 1,
    borderColor: '#FCA5A5',
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
    color: COLORS.error || '#DC2626',
    fontWeight: '500',
  },
  closeButton: {
    marginLeft: SIZES.padding / 2,
    padding: 4,
  },
});

export default ErrorMessage;

