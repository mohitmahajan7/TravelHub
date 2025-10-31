import { travelDeskApi, authApi, checkAuthStatus } from './api';

// Get current user from auth API
export const getCurrentUser = async () => {
  try {
    const userData = await authApi.get('/me');
    
    // Extract the actual role from different possible response formats
    let userRole = '';
    
    if (userData.roles && userData.roles.length > 0) {
      userRole = userData.roles.find(role => role === 'TRAVEL_DESK') || userData.roles[0];
    } else if (userData.authorities && userData.authorities.length > 0) {
      userRole = userData.authorities.find(auth => auth === 'TRAVEL_DESK') || userData.authorities[0];
    } else if (userData.role) {
      userRole = userData.role;
    } else if (userData.userRole) {
      userRole = userData.userRole;
    } else {
      userRole = 'TRAVEL_DESK';
    }
    
    userRole = String(userRole).toUpperCase();
    
    const processedUser = {
      ...userData,
      userName: userData.userName || (userData.email ? userData.email.split('@')[0] : 'Travel_Desk'),
      userId: userData.userId || userData.id,
      userRole: userRole,
      roles: userData.roles || [userRole]
    };
    
    return processedUser;
  } catch (error) {
    console.error('❌ Error fetching current user:', error);
    throw new Error(`Failed to get user data: ${error.message}`);
  }
};

// Fetch pending approvals
export const fetchPendingApprovals = async () => {
  try {
    const data = await travelDeskApi.get('/approvals/pending');
    return data;
  } catch (error) {
    console.error('❌ Error fetching pending approvals:', error);
    throw error;
  }
};

// Validate ticket using actual role from user data
export const validateTicket = async (workflowId, currentUser) => {
  if (!currentUser.userId) {
    throw new Error('User ID not available. Please check authentication.');
  }

  if (!currentUser.userRole) {
    throw new Error('User role not available. Please check authentication.');
  }

  // Use the ACTUAL role extracted from /auth/me
  const actualRole = currentUser.userRole;

  // Prepare request body with ACTUAL role
  const requestBody = {
    workflowId: workflowId,
    action: "APPROVE",
    approverRole: actualRole,
    approverId: currentUser.userId,
    approverName: currentUser.userName,
    comments: `Approved by ${actualRole} via web interface.`
  };

  try {
    const result = await travelDeskApi.post(`/approvals/${workflowId}/action`, requestBody);
    return result;
  } catch (error) {
    console.error('❌ Error validating ticket:', error);
    throw error;
  }
};

// Check authentication status and token
export const checkAuthentication = () => {
  return checkAuthStatus();
};

// Utility functions
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.includes(' ') ? dateString.replace(' ', 'T') : dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

export const getPurposeFromWorkflow = (workflowType) => {
  const purposeMap = {
    'PRE_TRAVEL': 'Pre-Travel Approval',
    'DURING_TRAVEL': 'During Travel Request',
    'POST_TRAVEL': 'Post-Travel Settlement'
  };
  return purposeMap[workflowType] || 'Travel Request';
};

export const getStatusText = (status) => {
  const statusMap = {
    'PENDING': 'Pending Validation',
    'APPROVED': 'Approved',
    'REJECTED': 'Rejected',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed'
  };
  return statusMap[status] || status || 'Pending Validation';
};

export const getUrgencyFromData = (ticket) => {
  if (ticket.dueDate) {
    const dueDate = new Date(ticket.dueDate.includes(' ') ? ticket.dueDate.replace(' ', 'T') : ticket.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) return 'high';
    if (diffDays <= 7) return 'medium';
  }
  
  if (ticket.priority === 'HIGH') return 'high';
  if (ticket.priority === 'MEDIUM') return 'medium';
  return 'low';
};