import { authService } from './authService';

const API_BASE_URL = '/travel-management/api';

class TravelRequestService {
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
      console.log(`🚀 Making API request to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      console.log(`📥 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API error: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const result = text ? JSON.parse(text) : [];
      console.log('✅ API response success:', result);
      return result;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all travel requests
  async getTravelRequests() {
    return this.request('/travel-requests');
  }

  // Get travel request by ID
 async getTravelRequestById(requestId) {
  try {
    console.log('🔍 [TravelRequestService] getTravelRequestById called:', requestId);
    
    const endpoint = `/travel-requests/${requestId}`;
    console.log('🔍 [TravelRequestService] Making request to:', endpoint);
    
    const response = await this.request(endpoint);
    console.log('✅ [TravelRequestService] Request successful:', response);
    
    return response;
  } catch (error) {
    console.error('❌ [TravelRequestService] Request failed:', error);
    throw error;
  }
}

  // Get user's travel requests (filtered by employeeId)
  async getUserTravelRequests(userId) {
    const allRequests = await this.getTravelRequests();
    return allRequests.filter(request => request.employeeId === userId);
  }
}

export const travelRequestService = new TravelRequestService();