// Utility functions for finance approvals

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// Format date time for display
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.replace(' ', 'T'));
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// Calculate days pending
export const getDaysPending = (createdAt) => {
  if (!createdAt) return 0;
  try {
    const created = new Date(createdAt.replace(' ', 'T'));
    const today = new Date();
    const diffTime = Math.abs(today - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (e) {
    return 0;
  }
};

// Get priority badge
export const getPriorityBadge = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return { class: 'priority-high', text: 'High' };
    case 'medium':
      return { class: 'priority-medium', text: 'Medium' };
    case 'normal':
      return { class: 'priority-normal', text: 'Normal' };
    default:
      return { class: 'priority-normal', text: 'Normal' };
  }
};

// Get status badge
export const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return { class: 'status-pending', text: 'Pending' };
    case 'approved':
      return { class: 'status-approved', text: 'Approved' };
    case 'rejected':
      return { class: 'status-rejected', text: 'Rejected' };
    case 'in_progress':
      return { class: 'status-in-progress', text: 'In Progress' };
    default:
      return { class: 'status-pending', text: 'Pending' };
  }
};

// Format request details for display
export const formatRequestDetails = (request) => {
  return `Finance Approval Details:
Request ID: ${request.travelRequestId}
Workflow ID: ${request.workflowId}
Workflow Type: ${request.workflowType}
Current Step: ${request.currentStep}
Status: ${request.status}
Priority: ${request.priority}
Due Date: ${request.dueDate}
Created: ${request.createdAt}
Last Updated: ${request.updatedAt}
Previous Step: ${request.previousStep}
Next Step: ${request.nextStep}
Estimated Cost: ${request.estimatedCost || 'N/A'}
Actual Cost: ${request.actualCost || 'N/A'}`;
};