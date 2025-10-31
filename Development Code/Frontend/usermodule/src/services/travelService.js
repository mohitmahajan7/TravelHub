import { authService } from './authService';

const API_BASE_URL = '/travel-management/api';

class TravelService {
  constructor() {
    this.authService = authService;
  }

  async request(endpoint, options = {}) {
    const token = this.authService.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      credentials: 'include',
      ...options,
      headers,
    };

    try {
      console.log(`🚀 Making API request to: ${API_BASE_URL}${endpoint}`, options.body ? JSON.parse(options.body) : 'No body');
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      console.log(`📥 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API error: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};
      console.log('✅ API response success:', result);
      return result;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Create travel request with exact body format
  async createTravelRequest(requestData) {
    return this.request('/travel-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getTravelRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/travel-requests${queryString ? `?${queryString}` : ''}`);
  }

  async getTravelRequestById(id) {
    return this.request(`/travel-requests/${id}`);
  }

  async updateTravelRequest(id, requestData) {
    return this.request(`/travel-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  }

  async deleteTravelRequest(id) {
    return this.request(`/travel-requests/${id}`, {
      method: 'DELETE',
    });
  }
}

export const travelService = new TravelService();