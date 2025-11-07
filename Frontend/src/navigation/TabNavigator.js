import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { LogoutModal } from '../components';

// Screens
import ScannerScreen from '../screens/ScannerScreen';
import KanbanScreen from '../screens/KanbanScreen';
import SearchScreen from '../screens/SearchScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.surface,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          },
          headerTitleStyle: {
            fontSize: SIZES.h3,
            fontWeight: 'bold',
            color: COLORS.text,
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogoutPress}
              style={styles.logoutButton}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={SIZES.iconSize} color={COLORS.error} />
            </TouchableOpacity>
          ),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          tabBarIconStyle: {
            width: 24,
            height: 24,
          },
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: SIZES.small,
            fontWeight: '600',
          },
          tabBarShowLabel: true,
          tabBarHideOnKeyboard: false,
        })}
      >
        <Tab.Screen
          name="Scanner"
          component={ScannerScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="barcode-outline" size={24} color={color} />
            ),
            tabBarLabel: 'Scan',
          }}
        />
        <Tab.Screen
          name="Kanban"
          component={KanbanScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="grid-outline" size={24} color={color} />
            ),
            tabBarLabel: 'Board',
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="search-outline" size={24} color={color} />
            ),
            tabBarLabel: 'Search',
          }}
        />
        <Tab.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="stats-chart-outline" size={24} color={color} />
            ),
            tabBarLabel: 'Analytics',
          }}
        />
      </Tab.Navigator>

      <LogoutModal
        visible={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: SIZES.padding,
    padding: SIZES.padding / 4,
  },
});

export default TabNavigator;

