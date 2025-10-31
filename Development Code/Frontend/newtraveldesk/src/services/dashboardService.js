import { travelDeskApi, checkAuthStatus } from './api';

// Fetch pending approvals from travel-desk API
export const fetchPendingApprovals = async () => {
  try {
    // Check authentication first
    const authStatus = checkAuthStatus();
    console.log('🔐 Auth status for dashboard:', authStatus);

    const data = await travelDeskApi.get('/approvals/pending');
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.content && Array.isArray(data.content)) {
      return data.content;
    } else if (data.items && Array.isArray(data.items)) {
      return data.items;
    } else {
      console.warn('Unexpected data format:', data);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching pending approvals:', error);
    throw error;
  }
};

// Fetch specific travel request details
export const fetchTravelRequestDetails = async (travelRequestId) => {
  try {
    const data = await travelDeskApi.get(`/requests/${travelRequestId}`);
    return data;
  } catch (error) {
    console.error('❌ Error fetching travel request details:', error);
    throw error;
  }
};

// Create booking for a travel request
export const createBooking = async (travelRequestId, bookingData) => {
  try {
    // Import travelManagementApi dynamically to avoid circular dependencies
    const { travelManagementApi } = await import('./api');
    
    const response = await travelManagementApi.post(`/travel-bookings/${travelRequestId}`, bookingData);
    return response;
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    throw error;
  }
};

// Calculate statistics from the pending requests data
export const calculateStats = (requests) => {
  if (!requests || !Array.isArray(requests)) {
    return {
      pendingValidation: 0,
      awaitingBooking: 0,
      policyExceptions: 0,
      bookedToday: 0,
      totalRequests: 0
    };
  }

  const pendingValidation = requests.filter(request => 
    request.status === 'PENDING' || 
    request.currentStep === 'TRAVEL_DESK_CHECK'
  ).length;

  const policyExceptions = requests.filter(request => 
    request.isOverpriced === true || 
    request.priority === 'HIGH' ||
    request.status === 'EXCEPTION'
  ).length;

  const awaitingBooking = requests.filter(request => 
    request.status === 'APPROVED' || 
    request.currentStep === 'TRAVEL_DESK_BOOKING' ||
    request.currentStep === 'READY_FOR_BOOKING'
  ).length;

  const today = new Date().toDateString();
  const bookedToday = requests.filter(request => {
    if (request.completedAt) {
      try {
        const completedDate = new Date(request.completedAt.replace(' ', 'T')).toDateString();
        return completedDate === today;
      } catch (e) {
        return false;
      }
    }
    return false;
  }).length;

  return {
    pendingValidation,
    awaitingBooking,
    policyExceptions,
    bookedToday,
    totalRequests: requests.length
  };
};

// Filter requests for booking queue (TRAVEL_DESK_BOOKING step)
export const getBookingQueueRequests = (requests) => {
  if (!requests || !Array.isArray(requests)) {
    return [];
  }
  
  return requests.filter(request => 
    request.currentStep === 'TRAVEL_DESK_BOOKING' ||
    request.status === 'APPROVED'
  );
};

// Filter requests for validation queue (TRAVEL_DESK_CHECK step)
export const getValidationQueueRequests = (requests) => {
  if (!requests || !Array.isArray(requests)) {
    return [];
  }
  
  return requests.filter(request => 
    request.currentStep === 'TRAVEL_DESK_CHECK' ||
    request.status === 'PENDING'
  );
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    // Handle different date formats
    const date = new Date(dateString.includes(' ') ? dateString.replace(' ', 'T') : dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    console.warn('Error formatting date:', dateString, e);
    return 'Invalid Date';
  }
};

// Format date time for display
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.includes(' ') ? dateString.replace(' ', 'T') : dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.warn('Error formatting datetime:', dateString, e);
    return 'Invalid Date';
  }
};

// Calculate days until due date
export const getDaysUntilDue = (dueDateString) => {
  if (!dueDateString) return null;
  
  try {
    const dueDate = new Date(dueDateString.includes(' ') ? dueDateString.replace(' ', 'T') : dueDateString);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (e) {
    console.warn('Error calculating due days:', dueDateString, e);
    return null;
  }
};

// Get status badge class and text
export const getStatusInfo = (request) => {
  const status = request.status;
  const currentStep = request.currentStep;
  const isOverpriced = request.isOverpriced;
  
  if (isOverpriced) {
    return { class: 'exception', text: 'Price Exception' };
  } else if (status === 'PENDING' && currentStep === 'TRAVEL_DESK_CHECK') {
    return { class: 'pending', text: 'Pending Validation' };
  } else if (status === 'PENDING' && currentStep === 'TRAVEL_DESK_BOOKING') {
    return { class: 'validation', text: 'Ready for Booking' };
  } else if (status === 'APPROVED') {
    return { class: 'validation', text: 'Ready for Booking' };
  } else if (status === 'COMPLETED') {
    return { class: 'booked', text: 'Booked' };
  } else if (status === 'REJECTED') {
    return { class: 'incomplete', text: 'Rejected' };
  } else {
    return { class: 'pending', text: status || 'Pending' };
  }
};

// Get priority badge
export const getPriorityBadge = (priority) => {
  switch (priority) {
    case 'HIGH':
      return { class: 'priority-high', text: 'High' };
    case 'MEDIUM':
      return { class: 'priority-medium', text: 'Medium' };
    case 'NORMAL':
      return { class: 'priority-normal', text: 'Normal' };
    case 'LOW':
      return { class: 'priority-low', text: 'Low' };
    default:
      return { class: 'priority-normal', text: priority || 'Normal' };
  }
};

// Get current step display text
export const getCurrentStepText = (currentStep) => {
  const stepMap = {
    'TRAVEL_DESK_CHECK': 'Travel Desk Check',
    'TRAVEL_DESK_BOOKING': 'Ready for Booking',
    'MANAGER_APPROVAL': 'Manager Approval',
    'FINANCE_APPROVAL': 'Finance Approval',
    'HR_APPROVAL': 'HR Approval',
    'READY_FOR_BOOKING': 'Ready for Booking',
    'COMPLETED': 'Completed'
  };
  return stepMap[currentStep] || currentStep;
};

// Get workflow type display text
export const getWorkflowTypeText = (workflowType) => {
  const typeMap = {
    'PRE_TRAVEL': 'Pre-Travel',
    'POST_TRAVEL': 'Post-Travel',
    'EMERGENCY': 'Emergency'
  };
  return typeMap[workflowType] || workflowType;
};

// Get estimated cost from request data
export const getEstimatedCost = (request) => {
  const cost = request.estimatedCost || request.actualCost;
  if (!cost) return '₹0';
  
  // Handle both string and number formats
  const costValue = typeof cost === 'string' ? parseFloat(cost.replace(/[^0-9.-]+/g, "")) : cost;
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(costValue);
};

// Transform API data to component format for BookingQueue
export const transformToBookingTicket = (apiData) => {
  return {
    id: apiData.travelRequestId,
    workflowId: apiData.workflowId,
    employee: `Employee ${apiData.travelRequestId.substring(0, 8)}`, // Placeholder
    employeeId: `E${apiData.travelRequestId.substring(0, 6)}`, // Placeholder
    department: getDepartmentFromRequest(apiData), // Placeholder
    travelDates: formatTravelDatesFromRequest(apiData),
    destination: getDestinationFromRequest(apiData), // Placeholder
    estimatedCost: getEstimatedCost(apiData),
    status: mapApiStatusToComponent(apiData.currentStep),
    statusText: getCurrentStepText(apiData.currentStep),
    approvalLevel: 'travel-desk',
    priority: mapApiPriorityToComponent(apiData.priority),
    travelType: getTravelTypeFromRequest(apiData), // Placeholder
    dueDate: apiData.dueDate,
    createdAt: apiData.createdAt,
    originalData: apiData
  };
};

// Helper function to map API status to component status
const mapApiStatusToComponent = (currentStep) => {
  switch (currentStep) {
    case 'TRAVEL_DESK_BOOKING':
      return 'approved';
    case 'TRAVEL_DESK_CHECK':
      return 'pending';
    default:
      return 'approved';
  }
};

// Helper function to map API priority to component priority
const mapApiPriorityToComponent = (apiPriority) => {
  switch (apiPriority) {
    case 'HIGH':
      return 'high';
    case 'NORMAL':
      return 'medium';
    case 'LOW':
      return 'low';
    default:
      return 'medium';
  }
};

// Placeholder functions - you can implement these based on your actual API data
const getDepartmentFromRequest = (request) => {
  // This should come from the actual API response
  const departments = ['Finance', 'Sales', 'Engineering', 'Marketing', 'HR', 'Operations'];
  return departments[Math.floor(Math.random() * departments.length)];
};

const getDestinationFromRequest = (request) => {
  // This should come from the actual API response
  const destinations = ['Pune', 'Bangalore', 'Delhi', 'Mumbai', 'Chennai', 'Hyderabad'];
  return destinations[Math.floor(Math.random() * destinations.length)];
};

const getTravelTypeFromRequest = (request) => {
  // This should come from the actual API response
  return Math.random() > 0.2 ? 'Domestic' : 'International';
};

const formatTravelDatesFromRequest = (request) => {
  // This should come from the actual travel request details
  if (request.dueDate) {
    return formatDate(request.dueDate);
  }
  return 'Date not available';
};

// Export default for backward compatibility
export default {
  fetchPendingApprovals,
  fetchTravelRequestDetails,
  createBooking,
  calculateStats,
  getBookingQueueRequests,
  getValidationQueueRequests,
  formatDate,
  formatDateTime,
  getDaysUntilDue,
  getStatusInfo,
  getPriorityBadge,
  getCurrentStepText,
  getWorkflowTypeText,
  getEstimatedCost,
  transformToBookingTicket
};