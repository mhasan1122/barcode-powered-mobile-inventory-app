import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants';
import { isValidBarcode } from '../utils/helpers';
import { getProductByBarcode, createProduct } from '../api';

const ScannerScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
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
      // First, check if product already exists
      const existingProductResponse = await getProductByBarcode(data);

      if (existingProductResponse.success && existingProductResponse.data) {
        // Product already exists
        Alert.alert(
          'Product Already Exists',
          `Barcode: ${data}\n\nProduct: ${existingProductResponse.data.name}\nCategory: ${existingProductResponse.data.category || 'Uncategorized'}`,
          [
            {
              text: 'OK',
              onPress: () => {
                setScanned(false);
                setLoading(false);
              },
            },
          ]
        );
        return;
      }

      // Try to fetch product from external API
      let productName = `Product ${data}`;
      let productPrice = 0;
      let productDescription = '';

      try {
        const externalResponse = await fetch(`https://assessment.shwapno.app/product/${data}`);
        if (externalResponse.ok) {
          const externalData = await externalResponse.json();
          productName = externalData.name || productName;
          productPrice = externalData.price || productPrice;
          productDescription = externalData.description || productDescription;
        }
      } catch (externalError) {
        // External API failed, use default values
        console.log('External API not available, using default product data');
      }

      // Create product in our database
      const createResponse = await createProduct({
        barcode: data,
        name: productName,
        price: productPrice,
        description: productDescription,
        category: 'Uncategorized',
      });

      if (createResponse.success) {
        Alert.alert(
          'Product Scanned',
          `Barcode: ${data}\n\nProduct "${productName}" has been added to inventory.`,
          [
            {
              text: 'OK',
              onPress: () => {
                setScanned(false);
                setLoading(false);
                // Navigate to Kanban screen to see the new product
                navigation.navigate('Kanban');
              },
            },
          ]
        );
      } else {
        throw new Error(createResponse.message || 'Failed to create product');
      }
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to process barcode. Please try again.'
      );
      setScanned(false);
      setLoading(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={36} color={COLORS.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-outline" size={64} color={COLORS.textLight} />
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

          <View style={[styles.controls, { bottom: 40 + insets.bottom }]}>
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
    </View>
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

