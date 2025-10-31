// API Configuration
const API_CONFIG = {
  TRAVEL_DESK_BASE_URL: '/travel-desk-proxy/api/travel-desk',
  TRAVEL_MANAGEMENT_BASE_URL: '/travel-management/api',
  AUTH_BASE_URL: '/api/auth',
  withCredentials: true
};

// Enhanced cookie detection that works with different domains
const getAuthToken = () => {
  try {
    // Method 1: Check all cookies in document.cookie
    const cookies = document.cookie.split(';');
    console.log('🍪 All cookies:', cookies);
    
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      console.log(`🔍 Checking cookie: ${name} = ${value ? value.substring(0, 20) + '...' : 'empty'}`);
      
      if (name === 'auth_token' && value && value !== 'null' && value !== 'undefined') {
        console.log('✅ Found auth_token in cookies');
        return value;
      }
    }

    // Method 2: Check if we're in a development environment and try localStorage as fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Development mode: Checking localStorage as fallback');
      const possibleKeys = ['auth_token', 'token', 'access_token', 'jwt_token', 'authToken'];
      
      for (const key of possibleKeys) {
        const token = localStorage.getItem(key);
        if (token && token !== 'null' && token !== 'undefined') {
          console.log(`✅ Found token in localStorage with key: ${key}`);
          return token;
        }
      }
    }

    console.log('❌ No auth token found in cookies or localStorage');
    return null;
  } catch (error) {
    console.error('❌ Error reading auth token:', error);
    return null;
  }
};

// Get headers with auth token
const getHeaders = () => {
  const headers = { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  const authToken = getAuthToken();
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
    headers['auth_token'] = authToken;
    headers['X-Auth-Token'] = authToken;
    console.log('🔐 Headers with auth token configured');
  } else {
    console.warn('⚠️ No auth token available for headers');
  }
  
  return headers;
};

// Enhanced fetch with better error handling
const enhancedFetch = async (url, options = {}) => {
  const config = {
    ...options,
    credentials: 'include', // Always include credentials for cross-origin requests
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  console.log('🚀 Making request to:', url);
  console.log('📋 Request config:', {
    method: config.method,
    credentials: config.credentials,
    hasAuth: !!config.headers.Authorization
  });

  try {
    const response = await fetch(url, config);
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (response.status === 401 || response.status === 403) {
      const error = new Error(`Authentication failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      error.status = response.status;
      throw error;
    }

    // Try to parse JSON, but handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
    throw error;
  }
};

// HTTP methods template for Travel Desk API
export const travelDeskApi = {
  get: async (endpoint) => {
    return enhancedFetch(`${API_CONFIG.TRAVEL_DESK_BASE_URL}${endpoint}`, {
      method: 'GET'
    });
  },

  post: async (endpoint, data) => {
    return enhancedFetch(`${API_CONFIG.TRAVEL_DESK_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

// HTTP methods template for Travel Management API
export const travelManagementApi = {
  get: async (endpoint) => {
    return enhancedFetch(`${API_CONFIG.TRAVEL_MANAGEMENT_BASE_URL}${endpoint}`, {
      method: 'GET'
    });
  },

  post: async (endpoint, data) => {
    return enhancedFetch(`${API_CONFIG.TRAVEL_MANAGEMENT_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

// Check authentication status with detailed debugging
export const checkAuthStatus = () => {
  const token = getAuthToken();
  const cookies = document.cookie.split(';').map(c => c.trim());
  
  const status = {
    hasToken: !!token,
    token: token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
    source: token ? 'cookie' : 'none',
    allCookies: cookies,
    cookieCount: cookies.length,
    domain: window.location.hostname
  };
  
  console.log('🔐 Detailed auth status:', status);
  return status;
};

// Test API connectivity
export const testApiConnectivity = async () => {
  try {
    console.log('🧪 Testing API connectivity...');
    const response = await fetch('/travel-desk-proxy/api/travel-desk/approvals/pending', {
      method: 'GET',
      credentials: 'include'
    });
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};


// HTTP methods template for Auth API
export const authApi = {
  // GET request
  get: async (endpoint) => {
    return enhancedFetch(`${API_CONFIG.AUTH_BASE_URL}${endpoint}`, {
      method: 'GET'
    });
  },

  // POST request
  post: async (endpoint, data) => {
    return enhancedFetch(`${API_CONFIG.AUTH_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

export default {
  travelDeskApi,
  travelManagementApi,
  checkAuthStatus,
  testApiConnectivity,
  authApi
};