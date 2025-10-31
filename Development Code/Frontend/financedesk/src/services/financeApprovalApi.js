// financeApprovalApi.js

// Use proxy paths - all finance approvals go through travel-desk-proxy
const API_BASE = '/api'; // For auth only
const TRAVEL_DESK_BASE = '/travel-desk-proxy'; // For all finance approval operations

// Manual token storage
let manualAuthToken = null;

// FIXED: Enhanced token detection with proper cookie parsing
const getAuthToken = () => {
  console.log('🔍 Searching for auth token...');
  
  // First check manual storage
  if (manualAuthToken) {
    console.log('✅ Found token in manual storage');
    return manualAuthToken;
  }
  
  // FIXED: Better cookie parsing
  const cookies = document.cookie.split(';');
  console.log('🍪 All cookies:', cookies);
  
  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    
    // Check for auth_token (from your screenshot)
    if (trimmedCookie.startsWith('auth_token=')) {
      const token = trimmedCookie.substring('auth_token='.length);
      if (token && token !== 'null' && token !== 'undefined') {
        console.log('✅ Found auth_token in cookies:', token.substring(0, 20) + '...');
        manualAuthToken = token;
        return token;
      }
    }
    
    // Check for JSESSIONID (from your screenshot)
    if (trimmedCookie.startsWith('JSESSIONID=')) {
      const token = trimmedCookie.substring('JSESSIONID='.length);
      if (token && token !== 'null' && token !== 'undefined') {
        console.log('✅ Found JSESSIONID in cookies');
        manualAuthToken = token;
        return token;
      }
    }
  }
  
  // Check localStorage as fallback
  const tokenKeys = ['auth_token', 'token', 'accessToken', 'authToken'];
  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);
    if (token && token !== 'null' && token !== 'undefined') {
      console.log(`✅ Found token in localStorage.${key}`);
      manualAuthToken = token;
      return token;
    }
  }
  
  // Check user_data in localStorage
  try {
    const userDataStr = localStorage.getItem('user_data');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      if (userData.token && userData.token !== 'null' && userData.token !== 'undefined') {
        console.log('✅ Found token in user_data.token');
        manualAuthToken = userData.token;
        return userData.token;
      }
      if (userData.accessToken && userData.accessToken !== 'null' && userData.accessToken !== 'undefined') {
        console.log('✅ Found token in user_data.accessToken');
        manualAuthToken = userData.accessToken;
        return userData.accessToken;
      }
    }
  } catch (e) {
    console.warn('Failed to parse user_data');
  }
  
  console.warn('❌ No auth token found in any location');
  console.log('🔍 Available cookies:', document.cookie);
  console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
  return null;
};

// Store token manually
export const setAuthToken = (token) => {
  manualAuthToken = token;
  localStorage.setItem('auth_token', token);
  console.log('💾 Auth token stored manually');
};

// Enhanced fetch with better error handling
const fetchWithAuth = async (url, options = {}) => {
  const authToken = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // ALWAYS add Authorization header when token is available
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
    console.log('🔐 Added Authorization header with Bearer token');
  } else {
    console.warn('⚠️ No auth token available - making request without Authorization header');
    // Don't add fallback token - let the backend handle authentication
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // This ensures cookies are sent
  };

  console.log(`🔄 Making request to: ${url}`);
  console.log('📤 Request headers:', headers);
  console.log('🍪 Cookies that will be sent:', document.cookie);

  try {
    const response = await fetch(url, config);
    
    console.log(`📋 Response status: ${response.status}`);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ API Error Response:', responseText);
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    try {
      const jsonResponse = JSON.parse(responseText);
      console.log('✅ API Success Response:', jsonResponse);
      return jsonResponse;
    } catch (e) {
      console.error('❌ JSON parse error:', responseText);
      throw new Error('Invalid JSON response');
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
    throw error;
  }
};

// Auth API calls - using /api proxy
export const authApi = {
  getCurrentUser: async () => {
    console.log('👤 Fetching current user from /api/auth/me...');
    const userData = await fetchWithAuth(`${API_BASE}/auth/me`, {
      method: 'GET',
    });
    
    // If we get user data successfully, store any token from response
    if (userData && (userData.token || userData.accessToken)) {
      const token = userData.token || userData.accessToken;
      setAuthToken(token);
    }
    
    console.log('✅ User data from /auth/me:', userData);
    return userData;
  },
};

// Finance approvals API calls - ALL through travel-desk-proxy
export const financeApprovalApi = {
  getPendingApprovals: async () => {
    console.log('📋 Fetching pending approvals from finance endpoint...');
    return await fetchWithAuth(
      `${TRAVEL_DESK_BASE}/api/finance/approvals/pending`,
      { method: 'GET' }
    );
  },

  approveRequest: async (workflowId, requestBody) => {
    console.log('📤 Making approval request for workflow:', workflowId);
    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));
    
    return await fetchWithAuth(
      `${TRAVEL_DESK_BASE}/api/finance/approvals/${workflowId}/action`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }
    );
  },

  rejectRequest: async (workflowId, requestBody) => {
    console.log('📤 Making rejection request for workflow:', workflowId);
    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2));
    
    return await fetchWithAuth(
      `${TRAVEL_DESK_BASE}/api/finance/approvals/${workflowId}/action`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
      }
    );
  },
};

// Local storage utilities
export const storageService = {
  setUserData: (userData) => {
    try {
      localStorage.setItem('user_data', JSON.stringify(userData));
      console.log('💾 User data stored in localStorage');
    } catch (e) {
      console.error('Failed to store user data:', e);
    }
  },

  getFallbackUserInfo: () => {
    try {
      const userDataStr = localStorage.getItem('user_data');
      return userDataStr ? JSON.parse(userDataStr) : null;
    } catch (e) {
      return null;
    }
  },
};

// Debug function to check auth status
export const debugAuth = () => {
  const cookies = document.cookie.split(';');
  const authToken = getAuthToken();
  
  return {
    hasAuthToken: !!authToken,
    authToken: authToken ? authToken.substring(0, 20) + '...' : null,
    cookies: cookies.map(c => c.trim()),
    localStorageKeys: Object.keys(localStorage),
    manualTokenStored: !!manualAuthToken
  };
};