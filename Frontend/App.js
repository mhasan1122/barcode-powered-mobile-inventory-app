import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import TabNavigator from './src/navigation/TabNavigator';
import { LoginScreen, RegistrationScreen } from './src/screens';
import { COLORS } from './src/constants';
import {
  isAuthenticated,
  setAuthenticated,
  saveUserData,
  saveAuthToken,
  getAuthToken,
  clearAuthData,
} from './src/utils/storage';

export default function App() {
  const [authenticated, setAuthenticatedState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isMounted) {
        console.warn('⚠️ Auth check timeout - showing login screen');
        setLoading(false);
        setAuthenticatedState(false);
      }
    }, 5000); // 5 second timeout

    const runAuthCheck = async () => {
      try {
        await checkAuthStatus();
      } finally {
        if (isMounted) {
          clearTimeout(timeout);
        }
      }
    };

    runAuthCheck();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      
      // Check if user has a valid token and is marked as authenticated
      const authStatus = await isAuthenticated();
      const token = await getAuthToken();
      
      console.log('Auth status:', { authStatus, hasToken: !!token });
      
      // Only set authenticated if both status and token exist
      if (authStatus && token) {
        console.log('✅ User is authenticated');
        setAuthenticatedState(true);
      } else {
        // Clear invalid auth state
        if (authStatus && !token) {
          console.log('⚠️ Clearing invalid auth state (no token)');
          await setAuthenticated(false);
        }
        console.log('❌ User is not authenticated - showing login');
        setAuthenticatedState(false);
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      setAuthenticatedState(false);
    } finally {
      setLoading(false);
      console.log('✅ Auth check completed');
    }
  };

  const handleLogin = async (credentials) => {
    try {
      // LoginScreen now passes token and user data from API
      const { token, user, username } = credentials;
      
      if (token && user) {
        // Save authentication data from API response
        await saveAuthToken(token);
        await saveUserData({ 
          username: user.username || username,
          id: user.id,
        });
        await setAuthenticated(true);
        setAuthenticatedState(true);
      } else {
        console.error('No token or user data received from login');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleNavigateToRegistration = () => {
    setShowRegistration(true);
  };

  const handleNavigateToLogin = () => {
    setShowRegistration(false);
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Logging out...');
      await clearAuthData();
      setAuthenticatedState(false);
      setShowRegistration(false);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Still set authenticated to false even if clear fails
      setAuthenticatedState(false);
    }
  };

  // Show loading screen while checking auth status
  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  // Always show login/registration when not authenticated
  // This ensures login screen shows on reload if not authenticated
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={COLORS.surface} />
          {authenticated ? (
            <TabNavigator onLogout={handleLogout} />
          ) : showRegistration ? (
            <RegistrationScreen
              onRegister={handleLogin}
              onNavigateToLogin={handleNavigateToLogin}
            />
          ) : (
            <LoginScreen
              onLogin={handleLogin}
              onNavigateToRegistration={handleNavigateToRegistration}
            />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
