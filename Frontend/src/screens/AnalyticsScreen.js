import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS, DEFAULT_CATEGORY } from '../constants';
import { getProductStats, getCategories } from '../api';
import { getCategoryColor } from '../utils/helpers';

const AnalyticsScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    categoryCounts: {},
    recentProducts: [],
  });

  useEffect(() => {
    loadData();
    
    // Refresh data when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsResponse, categoriesResponse] = await Promise.all([
        getProductStats(),
        getCategories(),
      ]);

      if (statsResponse.success) {
        const statsData = statsResponse.data || {};
        const categories = categoriesResponse.success ? (categoriesResponse.data || []) : [];

        setStats({
          totalProducts: statsData.totalProducts || 0,
          totalCategories: categories.length || 0,
          categoryCounts: statsData.categoryCounts || {},
          recentProducts: statsData.recentProducts || [],
        });
      } else {
        console.error('Failed to load stats:', statsResponse.message);
        setStats({
          totalProducts: 0,
          totalCategories: 0,
          categoryCounts: {},
          recentProducts: [],
        });
      }
    } catch (error) {
      console.error('Load data error:', error);
      setStats({
        totalProducts: 0,
        totalCategories: 0,
        categoryCounts: {},
        recentProducts: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, label, value, color = COLORS.primary }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Analytics Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="cube-outline"
          label="Total Products"
          value={stats.totalProducts}
          color={COLORS.primary}
        />
        <StatCard
          icon="folder-outline"
          label="Categories"
          value={stats.totalCategories}
          color={COLORS.secondary}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Products by Category</Text>
        {Object.keys(stats.categoryCounts).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No categories yet</Text>
          </View>
        ) : (
          <View style={styles.categoryList}>
            {Object.entries(stats.categoryCounts).map(([category, count]) => {
              const color = getCategoryColor(category);
              const percentage = stats.totalProducts > 0
                ? ((count / stats.totalProducts) * 100).toFixed(1)
                : 0;

              return (
                <View key={category} style={styles.categoryItem}>
                  <View style={styles.categoryHeader}>
                    <View style={[styles.categoryColorDot, { backgroundColor: color }]} />
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryCount}>{count}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${percentage}%`, backgroundColor: color },
                      ]}
                    />
                  </View>
                  <Text style={styles.percentageText}>{percentage}%</Text>
                </View>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Kanban')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        {stats.recentProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No products yet</Text>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => navigation.navigate('Scanner')}
            >
              <Ionicons name="barcode-outline" size={20} color={COLORS.surface} />
              <Text style={styles.scanButtonText}>Scan Your First Product</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.recentProductsList}>
            {stats.recentProducts.map((product, index) => (
              <View key={product.id || product._id || product.barcode || index} style={styles.recentProductItem}>
                <View style={styles.recentProductInfo}>
                  <Text style={styles.recentProductName} numberOfLines={1}>
                    {product.name || product.productName || 'Unknown Product'}
                  </Text>
                  <Text style={styles.recentProductBarcode}>
                    {product.barcode || 'N/A'}
                  </Text>
                </View>
                <View style={styles.recentProductCategory}>
                  <View
                    style={[
                      styles.categoryBadge,
                      {
                        backgroundColor:
                          getCategoryColor(product.category || DEFAULT_CATEGORY) + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryBadgeText,
                        {
                          color: getCategoryColor(product.category || DEFAULT_CATEGORY),
                        },
                      ]}
                    >
                      {product.category || DEFAULT_CATEGORY}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '700',
    color: COLORS.text,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: SIZES.padding,
    gap: SIZES.padding,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: SIZES.h1,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.surface,
    margin: SIZES.padding,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: SIZES.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryList: {
    gap: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryCount: {
    fontSize: SIZES.body,
    fontWeight: '700',
    color: COLORS.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  recentProductsList: {
    gap: 12,
  },
  recentProductItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recentProductInfo: {
    flex: 1,
  },
  recentProductName: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  recentProductBarcode: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },
  recentProductCategory: {
    marginLeft: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusSmall,
  },
  categoryBadgeText: {
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: SIZES.radius,
    marginTop: 24,
    ...SHADOWS.small,
  },
  scanButtonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.surface,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
  },
});

export default AnalyticsScreen;

