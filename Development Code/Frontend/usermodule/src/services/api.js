// src/services/api.js

const BASE_URLS = {
  auth: '/api/auth',
  travel: '/travel-management/api',
  travelDesk: '/travel-desk-proxy'
};

class ApiService {
  constructor() {
    this.baseUrls = BASE_URLS;
  }

  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    console.log('🔐 Token found:', !!token);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Helper to get cookie value
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Enhanced request method
  async request(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const config = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include',
    };

    console.log(`🔄 Making ${config.method || 'GET'} request to: ${url}`);

    try {
      const response = await fetch(url, config);
      
      console.log(`📊 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorText = 'No error details';
        try {
          errorText = await response.text();
        } catch (e) {
          // Ignore
        }
        
        const error = new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      console.log(`✅ Request successful`);
      return data;
      
    } catch (error) {
      console.error('🚨 Request failed:', error.message);
      throw error;
    }
  }

  // Build full URL - FIXED to use correct endpoints
  buildUrl(endpoint) {
    console.log(`🔗 Building URL for: ${endpoint}`);
    
    // Handle specific endpoints directly to avoid confusion
    if (endpoint === '/travel-requests') {
      return `${this.baseUrls.travel}/travel-requests`;
    }
    
    if (endpoint === '/auth/me') {
      return `${this.baseUrls.auth}/me`;
    }
    
    // Auth endpoints
    if (endpoint.startsWith('/auth/')) {
      const path = endpoint.replace('/auth', '');
      return `${this.baseUrls.auth}${path}`;
    }
    
    // Travel endpoints - FIXED: use exact mapping
    if (endpoint.startsWith('/travel/')) {
      const path = endpoint.replace('/travel', '');
      return `${this.baseUrls.travel}${path}`;
    }
    
    // Default - assume it's already a full path
    return endpoint;
  }

  // HTTP method shortcuts
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth methods
  async getCurrentUser() {
    console.log('👤 Getting current user...');
    
    try {
      const response = await this.get('/auth/me');
      console.log('✅ User profile fetched successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      throw error;
    }
  }

  // Travel request methods - FIXED: use the correct endpoint that maps to /travel-management/api/travel-requests
  async getTravelRequests() {
    try {
      console.log('✈️ Fetching travel requests...');
      
      // This should map to /travel-management/api/travel-requests
      const response = await this.get('/travel-requests');
      console.log('✅ Travel requests fetched successfully');
      return response;
      
    } catch (error) {
      console.error('❌ Failed to fetch travel requests:', error);
      throw error;
    }
  }

  async getTravelRequestById(id) {
    return this.get(`/travel-requests/${id}`);
  }

  async createTravelRequest(data) {
    return this.post('/travel-requests', data);
  }

  async updateTravelRequest(id, data) {
    return this.put(`/travel-requests/${id}`, data);
  }

  async deleteTravelRequest(id) {
    return this.delete(`/travel-requests/${id}`);
  }

  // Check authentication status
  isAuthenticated() {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    return !!token;
  }

  async getEmployeeById(employeeId) {
  try {
    console.log('👤 Fetching employee data...');
    
    // Use the full employee API endpoint
    const endpoint = `http://bwc-97.brainwaveconsulting.co.in:8080/ems/api/v1/employees/${employeeId}`;
    
    const response = await this.get(endpoint);
    console.log('✅ Employee data fetched successfully');
    return response;
    
  } catch (error) {
    console.error('❌ Failed to fetch employee data:', error);
    throw error;
  }
}

async updateEmployee(employeeId, data) {
  try {
    console.log('📝 Updating employee data...');
    
    // Use the full employee API endpoint
    const endpoint = `http://bwc-97.brainwaveconsulting.co.in:8080/ems/api/v1/employees/${employeeId}`;
    
    const response = await this.put(endpoint, data);
    console.log('✅ Employee data updated successfully');
    return response;
    
  } catch (error) {
    console.error('❌ Failed to update employee data:', error);
    throw error;
  }
}

}

// Create and export the main API service instance
export const apiService = new ApiService();
export default apiService;