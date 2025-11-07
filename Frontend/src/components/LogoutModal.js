import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';

const LogoutModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              {/* Icon Container */}
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <Ionicons name="log-out-outline" size={48} color={COLORS.error} />
                </View>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>Logout</Text>
                <Text style={styles.message}>
                  Are you sure you want to logout? You'll need to sign in again to access your account.
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.logoutButton]}
                  onPress={onConfirm}
                  activeOpacity={0.8}
                >
                  <Ionicons name="log-out" size={20} color={COLORS.surface} style={styles.logoutIcon} />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    width: '100%',
    maxWidth: 400,
    padding: SIZES.padding * 1.5,
    ...SHADOWS.large,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SIZES.margin,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.error + '30',
  },
  content: {
    alignItems: 'center',
    marginBottom: SIZES.margin * 1.5,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.margin / 2,
    textAlign: 'center',
  },
  message: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    gap: SIZES.padding / 2,
    marginTop: SIZES.margin,
  },
  button: {
    flex: 1,
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
  logoutButton: {
    backgroundColor: COLORS.error,
    ...SHADOWS.small,
  },
  logoutButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.surface,
  },
  logoutIcon: {
    marginRight: 6,
  },
});

export default LogoutModal;

