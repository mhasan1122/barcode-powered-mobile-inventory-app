import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';
import { isValidBarcode } from '../utils/helpers';

const ScannerScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facing, setFacing] = useState('back');

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || loading) return;

    if (!isValidBarcode(data)) {
      Alert.alert('Invalid Barcode', 'Please scan a valid barcode');
      return;
    }

    setScanned(true);
    setLoading(true);

    try {
      // TODO: Replace with actual API call when backend is ready
      // const response = await fetch(`https://assessment.shwapno.app/product/${data}`);
      // const productData = await response.json();
      
      // For now, simulate API response
      const productData = {
        barcode: data,
        name: `Product ${data}`,
        price: (Math.random() * 100).toFixed(2),
        description: 'Product description from API',
        category: 'Uncategorized',
        createdAt: new Date().toISOString(),
      };

      Alert.alert(
        'Product Scanned',
        `Barcode: ${data}\n\nProduct will be added to inventory.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setScanned(false);
              setLoading(false);
              // TODO: Navigate to Kanban screen or show success message
              // navigation.navigate('Kanban');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch product details');
      setScanned(false);
      setLoading(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size={36} color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Ionicons name="camera-outline" size={64} color={COLORS.textLight} />
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scannerFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={styles.instructionText}>
            Position the barcode within the frame
          </Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size={36} color={COLORS.surface} />
              <Text style={styles.loadingText}>Fetching product details...</Text>
            </View>
          )}

          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse-outline" size={28} color={COLORS.surface} />
            </TouchableOpacity>
            
            {scanned && (
              <TouchableOpacity
                style={[styles.controlButton, styles.scanAgainButton]}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.scanAgainText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionText: {
    color: COLORS.surface,
    fontSize: SIZES.body,
    marginTop: 40,
    textAlign: 'center',
    paddingHorizontal: SIZES.padding,
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.surface,
    fontSize: SIZES.body,
    marginTop: 12,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 50,
    ...SHADOWS.medium,
  },
  scanAgainButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
  },
  scanAgainText: {
    color: COLORS.surface,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  permissionText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    ...SHADOWS.small,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
});

export default ScannerScreen;

