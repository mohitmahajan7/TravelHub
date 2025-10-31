// src/services/dashboardService.js
import { apiService } from './api'; // Import the correct apiService

export const dashboardService = {
  async fetchUserProfile() {
    try {
      console.log('👤 Fetching user profile...');
      const profile = await apiService.getCurrentUser();
      console.log('✅ User profile fetched successfully');
      return profile;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      throw error;
    }
  },

  async fetchTravelRequests() {
    try {
      console.log('✈️ Fetching travel requests...');
      const response = await apiService.getTravelRequests();
      console.log('✅ Travel requests fetched successfully');
      
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      } else if (response && response.data) {
        return response.data;
      } else if (response && response.requests) {
        return response.requests;
      } else {
        console.warn('⚠️ Unexpected response format, returning as array:', response);
        return Array.isArray(response) ? response : [response];
      }
    } catch (error) {
      console.error('❌ Error fetching travel requests:', error);
      // Return empty array instead of throwing to prevent dashboard crash
      return [];
    }
  },

  // Filter user requests based on employeeId
  filterUserRequests(requests, userId) {
    if (!requests || !Array.isArray(requests)) {
      console.warn('⚠️ Invalid requests data, returning empty array');
      return [];
    }
    
    console.log(`🔍 Filtering ${requests.length} requests for user: ${userId}`);
    
    const userRequests = requests.filter(request => {
      // Try different possible employee ID fields
      const requestUserId = request.employeeId || request.userId || request.employee?.id;
      const matches = requestUserId === userId;
      return matches;
    });
    
    console.log(`✅ User requests found: ${userRequests.length}`);
    return userRequests;
  },

  // Calculate statistics based on actual status from backend
  calculateStats(requests) {
    if (!requests || !Array.isArray(requests)) {
      return {
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        draft: 0
      };
    }

    const approved = requests.filter(req => {
      const status = req.status || req.approvalStatus;
      return status && status.toLowerCase().includes('approved');
    }).length;

    const pending = requests.filter(req => {
      const status = req.status || req.approvalStatus;
      return !status || status.toLowerCase().includes('pending');
    }).length;

    const rejected = requests.filter(req => {
      const status = req.status || req.approvalStatus;
      return status && status.toLowerCase().includes('rejected');
    }).length;

    const draft = requests.filter(req => {
      const status = req.status || req.approvalStatus;
      return status && status.toLowerCase().includes('draft');
    }).length;

    return {
      total: requests.length,
      approved,
      pending,
      rejected,
      draft
    };
  },

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  },

  // Calculate duration in days
  calculateDuration(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } catch (error) {
      return 0;
    }
  },

  // Prepare display data for table
  prepareDisplayData(requests, limit = 5) {
    if (!requests || !Array.isArray(requests)) {
      return [];
    }

    return requests.slice(0, limit).map(request => {
      const requestData = {
        id: request.travelRequestId || request.id || request.requestId || 'N/A',
        destination: request.destination || request.purpose || request.location || 'Business Travel',
        purpose: request.purpose || request.description || 'Business Travel',
        startDate: request.startDate || request.travelStartDate,
        endDate: request.endDate || request.travelEndDate,
        status: (request.status || 'pending').toLowerCase(),
        employeeId: request.employeeId || request.userId
      };

      return {
        ...requestData,
        dates: `${this.formatDate(requestData.startDate)} - ${this.formatDate(requestData.endDate)}`,
        duration: this.calculateDuration(requestData.startDate, requestData.endDate),
        stage: this.getStageFromStatus(requestData.status)
      };
    });
  },

  // Get stage from status
  getStageFromStatus(status) {
    const stageMap = {
      'draft': 'Draft',
      'pending': 'Under Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'completed': 'Completed'
    };
    
    return stageMap[status] || 'Submitted';
  },

  // Get request status for display
  getStatusDisplay(status) {
    const statusMap = {
      'approved': { text: 'Approved', className: 'approved' },
      'pending': { text: 'Pending', className: 'pending' },
      'rejected': { text: 'Rejected', className: 'rejected' },
      'draft': { text: 'Draft', className: 'draft' },
      'submitted': { text: 'Submitted', className: 'pending' },
      'in_review': { text: 'In Review', className: 'pending' },
      'completed': { text: 'Completed', className: 'approved' }
    };

    return statusMap[status] || { text: 'Unknown', className: 'draft' };
  }
};

export default dashboardService;