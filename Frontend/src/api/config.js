// Environment configuration for different deployment scenarios

export const ENVIRONMENT = {
  // Development environment
  DEV: {
    BACKEND_URL: ['http://192.168.0.105:5000', 'http://localhost:5000', 'http://127.0.0.1:5000'], // Array of fallback URLs // Use first if available, else second
    API_TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3, // Increased retry attempts
    RETRY_DELAY: 1000,
    AUTO_DISCOVERY: true, // Enable automatic backend discovery
    NETWORK_CHECK_INTERVAL: 30000, // 30 seconds
  },
  
  // Local development (same machine)
  LOCAL: {
    BACKEND_URL: 'http://localhost:5000',
    API_TIMEOUT: 5000,
    RETRY_ATTEMPTS: 2,
    RETRY_DELAY: 500,
    AUTO_DISCOVERY: true,
    NETWORK_CHECK_INTERVAL: 15000, // 15 seconds for local
  },
  
  // Production environment (update this when deploying)
  PROD: {
    BACKEND_URL: 'https://barcode-powered-mobile-inventory-app-1.onrender.com',
    API_TIMEOUT: 15000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 2000,
    AUTO_DISCOVERY: false, // Disable auto-discovery in production
    NETWORK_CHECK_INTERVAL: 60000, // 1 minute for production
  }
};

// Current environment - set to PROD to use hosted backend
// You can manually override by setting: export const CURRENT_ENV = 'DEV' or 'LOCAL';
// Options: 'DEV', 'LOCAL', 'PROD'
// Using PROD by default since backend is hosted on Render
export const CURRENT_ENV = 'PROD';

// Get current environment configuration
export const getCurrentConfig = () => {
  return ENVIRONMENT[CURRENT_ENV];
};

// Helper function to get backend URL
export const getBackendURL = () => {
  const url = getCurrentConfig().BACKEND_URL;
  const backendURL = Array.isArray(url) ? url[0] : url;
  console.log(`🔗 Backend URL: ${backendURL}`);
  return backendURL;
};

// Helper function to get all available backend URLs
export const getAllBackendURLs = () => {
  const config = getCurrentConfig();
  if (Array.isArray(config.BACKEND_URL)) {
    return config.BACKEND_URL;
  }
  return [config.BACKEND_URL];
};

// Helper function to get API timeout
export const getAPITimeout = () => {
  return getCurrentConfig().API_TIMEOUT;
};

// Helper function to check if auto-discovery is enabled
export const isAutoDiscoveryEnabled = () => {
  return getCurrentConfig().AUTO_DISCOVERY;
};

// Helper function to get network check interval
export const getNetworkCheckInterval = () => {
  return getCurrentConfig().NETWORK_CHECK_INTERVAL;
};

// Function to update backend URL dynamically
export const updateBackendURL = (newURL) => {
  const currentConfig = getCurrentConfig();
  if (currentConfig) {
    // Update the environment configuration
    currentConfig.BACKEND_URL = newURL;
    console.log(`✅ Backend URL updated to: ${newURL}`);
  }
};

// Function to get fallback URLs for network discovery
export const getFallbackURLs = () => {
  return [
    // Current machine IP (primary)
    'http://localhost:5000',      // Local
    'http://127.0.0.1:5000',     // Local
    'http://10.0.2.2:5000',      // Android emulator
  ];
};



