// src/services/profileService.js
import { apiService } from './api';





export const profileService = {
  // Fetch user profile from auth endpoint and employee endpoint
  async fetchUserProfile() {
    try {
      console.log('👤 Fetching user profile from auth endpoint...');
      const authResponse = await apiService.getCurrentUser();
      console.log('✅ Auth profile fetched successfully:', authResponse);

      // If we have userId from auth, fetch detailed employee data
      if (authResponse?.userId) {
        console.log('👤 Fetching detailed employee data...');
        
        // Use the full employee API endpoint
        const employeeEndpoint = `http://bwc-97.brainwaveconsulting.co.in:8080/ems/api/v1/employees/${authResponse.userId}`;
        
        try {
          const employeeResponse = await apiService.get(employeeEndpoint);
          console.log('✅ Employee data fetched successfully:', employeeResponse);
          
          // Merge auth data with employee data (employee data is in response.data)
          return {
            ...authResponse,
            ...employeeResponse.data // Employee data is in the data property
          };
        } catch (employeeError) {
          console.warn('⚠️ Could not fetch employee details, using auth data only:', employeeError);
          return authResponse;
        }
      }
      
      return authResponse;
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      throw error;
    }
  },

  // Update employee profile
  async updateEmployeeProfile(userId, updateData) {
  try {
    console.log('📝 Updating employee profile for user:', userId);
    console.log('📝 Update data received:', updateData);
    
    // First, get the current employee data to preserve other fields
    const currentEmployeeEndpoint = `http://bwc-97.brainwaveconsulting.co.in:8080/ems/api/v1/employees/${userId}`;
    const currentResponse = await apiService.get(currentEmployeeEndpoint);
    const currentData = currentResponse.data;
    
    console.log('📋 Current employee data structure:', currentData);
    console.log('🔍 Current employee data keys:', Object.keys(currentData));
    
    // Prepare the update payload with all required fields
    const updatePayload = {
      fullName: currentData.fullName, // Keep existing name
      email: currentData.email, // Keep existing email
      phoneNumber: updateData.phoneNumber || currentData.phoneNumber,
      department: currentData.department, // Keep existing department
      level: currentData.level || 'Senior', // Keep existing level or default
      managerId: currentData.managerId || null, // Keep existing manager
      roleIds: currentData.roleIds || [], // Keep existing roles
      projectIds: currentData.projectIds || [] // Keep existing projects
    };
    
    // Handle location - check if location field exists in the current data
    // If location field exists in the API, update it
    if (updateData.location) {
      // Try different possible field names for location
      if (currentData.location !== undefined) {
        updatePayload.location = updateData.location;
      } else if (currentData.officeLocation !== undefined) {
        updatePayload.officeLocation = updateData.location;
      } else if (currentData.address !== undefined) {
        updatePayload.address = updateData.location;
      } else {
        // If no location field exists, add it
        updatePayload.location = updateData.location;
      }
    }

    console.log('📤 Final update payload:', updatePayload);
    
    // Use the full employee API endpoint for update
    const updateEndpoint = `http://bwc-97.brainwaveconsulting.co.in:8080/ems/api/v1/employees/${userId}`;
    
    const response = await apiService.put(updateEndpoint, updatePayload);
    console.log('✅ Employee profile updated successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error updating employee profile:', error);
    throw error;
  }
},
  // Generate avatar URL
  generateAvatarUrl(name, email) {
    const nameToUse = name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nameToUse)}&background=0D8ABC&color=fff&size=150`;
  },

  // Format date for display
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  },

  // Get display name from profile data
  getDisplayName(profile) {
    if (!profile) return 'User';
    
    return profile.fullName || 
           profile.name || 
           `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 
           profile.username ||
           profile.email?.split('@')[0] ||
           'User';
  },

  // Get department
  getDepartment(profile) {
    if (!profile) return 'Not specified';
    return profile.department || profile.role || 'Not specified';
  },

  // Get email
  getEmail(profile) {
    if (!profile) return 'N/A';
    return profile.email || 'N/A';
  },

  // Get user ID
  getUserId(profile) {
    if (!profile) return 'N/A';
    return profile.userId || profile.id || profile.employeeId || 'N/A';
  },

  // Get phone number
  getPhoneNumber(profile) {
    if (!profile) return 'N/A';
    return profile.phoneNumber || profile.phone || profile.mobile || 'N/A';
  },

  // Get position
  getPosition(profile) {
    if (!profile) return 'N/A';
    return profile.position || profile.jobTitle || profile.role || profile.level || 'N/A';
  },

  // Get location
 getLocation(profile) {
  if (!profile) return 'N/A';
  
  // Check multiple possible field names for location
  return profile.location || 
         profile.officeLocation || 
         profile.address || 
         profile.workLocation ||
         profile.city ||
         'N/A';
},

  // Get join date
  getJoinDate(profile) {
    if (!profile) return 'N/A';
    return this.formatDate(profile.dateJoined || profile.createdAt || profile.joinDate || profile.registrationDate || profile.hireDate);
  },

  // Get manager info
  getManagerInfo(profile) {
    if (!profile?.manager) return null;
    
    return {
      name: profile.manager.fullName || profile.manager.name || profile.manager.email || 'N/A',
      email: profile.manager.email || 'N/A'
    };
  },

  // Check if user is active
  isUserActive(profile) {
    return profile?.active !== false && profile?.status !== 'INACTIVE';
  },

  // Get user roles
  getUserRoles(profile) {
    if (!profile?.roles || !Array.isArray(profile.roles)) return [];
    return profile.roles;
  },

  // Get user permissions
  getUserPermissions(profile) {
    if (!profile?.permissions || !Array.isArray(profile.permissions)) return [];
    return profile.permissions;
  },

  // Get assigned projects
  getAssignedProjects(profile) {
    if (!profile?.projects || !Array.isArray(profile.projects)) return [];
    return profile.projects;
  },

  // Get profile status for badge
  getProfileStatus(profile) {
    return this.isUserActive(profile) ? 'active' : 'inactive';
  },

  // Validate profile data
  validateProfile(profile) {
    if (!profile) return false;
    
    const requiredFields = ['userId', 'email'];
    return requiredFields.some(field => profile[field]);
  },

  // Prepare profile data for display
 prepareProfileData(profile) {
  if (!profile) return null;

  console.log('🔍 Raw profile structure for location:', {
    hasLocation: !!profile.location,
    locationValue: profile.location,
    allKeys: Object.keys(profile),
    rawData: profile
  });

  const preparedData = {
    displayName: this.getDisplayName(profile),
    email: this.getEmail(profile),
    userId: this.getUserId(profile),
    department: this.getDepartment(profile),
    phoneNumber: this.getPhoneNumber(profile),
    position: this.getPosition(profile),
    location: this.getLocation(profile),
    joinDate: this.getJoinDate(profile),
    manager: this.getManagerInfo(profile),
    roles: this.getUserRoles(profile),
    permissions: this.getUserPermissions(profile),
    projects: this.getAssignedProjects(profile),
    isActive: this.isUserActive(profile),
    status: this.getProfileStatus(profile),
    avatarUrl: this.generateAvatarUrl(this.getDisplayName(profile), this.getEmail(profile)),
    rawData: profile
  };

  console.log('📊 Prepared profile data:', preparedData);
  return preparedData;
}
};

export default profileService;