// traveldesk/src/components/ValidationQueue/ValidationQueue.jsx
import React, { useState, useEffect } from 'react';
import {
  getCurrentUser,
  fetchPendingApprovals,
  validateTicket,
  checkAuthentication,
  formatDate,
  getPurposeFromWorkflow,
  getStatusText,
  getUrgencyFromData
} from '../services/validationQueueService';
import './ValidationQueue.css';

const ValidationQueue = ({ onTicketClick }) => {
  const [validationTickets, setValidationTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [validatingId, setValidatingId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  const [filters, setFilters] = useState({
    status: 'all',
    travelDate: '',
    search: ''
  });

  // Initialize component
  useEffect(() => {
    const initialize = async () => {
      try {
        const authStatus = checkAuthentication();
        console.log('🔐 Initial auth status:', authStatus);

        const user = await getCurrentUser();
        setUserInfo(user);
        await loadPendingApprovals();
      } catch (error) {
        console.error('❌ Initialization failed:', error);
        setError(error.message);
      }
    };

    initialize();
  }, []);

  // Load pending approvals
  const loadPendingApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPendingApprovals();
      setValidationTickets(data);
    } catch (error) {
      console.error('❌ Failed to fetch pending approvals:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle validation
  const handleValidate = async (ticket) => {
    try {
      setActionLoading(true);
      setValidatingId(ticket.workflowId);
      
      const currentUser = userInfo || await getCurrentUser();
      const result = await validateTicket(ticket.workflowId, currentUser);
      
      alert(`✅ Successfully approved!\n\nRequest ID: ${ticket.id}\nWorkflow ID: ${ticket.workflowId}\nApproved by: ${currentUser.userName} (${currentUser.userRole})\nStatus: Approved`);
      
      await loadPendingApprovals();
      
    } catch (error) {
      console.error('❌ Validation failed:', error);
      
      if (error.message.includes('403')) {
        const currentUser = userInfo || await getCurrentUser();
        alert(`🔒 Access Denied\n\nUser: ${currentUser.userName}\nRole: ${currentUser.userRole}\nError: ${error.message}\n\nPlease ensure your role has approval permissions.`);
      } else {
        alert(`❌ Approval Failed\n\n${error.message}\n\nRequest ID: ${ticket.id}\nWorkflow ID: ${ticket.workflowId}`);
      }
    } finally {
      setActionLoading(false);
      setValidatingId(null);
    }
  };

  // Map tickets for display
  const getMappedTickets = () => {
    return validationTickets.map(ticket => ({
      id: ticket.travelRequestId || `TR-${ticket.workflowId?.substring(0, 8) || 'N/A'}`,
      workflowId: ticket.workflowId,
      employee: ticket.employeeName || 'Employee',
      department: ticket.department || 'Department',
      travelDates: formatDate(ticket.travelStartDate) || formatDate(ticket.dueDate) || 'Dates not specified',
      estimatedCost: ticket.estimatedCost ? `₹${ticket.estimatedCost.toLocaleString()}` : 'Cost not specified',
      purpose: getPurposeFromWorkflow(ticket.workflowType),
      status: ticket.status ? ticket.status.toLowerCase() : 'pending',
      statusText: getStatusText(ticket.status),
      urgency: getUrgencyFromData(ticket),
      priority: ticket.priority,
      originalData: ticket
    }));
  };

  // Filter and paginate tickets
  const getFilteredAndPaginatedTickets = () => {
    const mappedTickets = getMappedTickets();
    
    // Apply filters
    let filteredTickets = mappedTickets;
    
    if (filters.status !== 'all') {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.status.toUpperCase() === filters.status.toUpperCase()
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.id.toLowerCase().includes(searchLower) ||
        ticket.employee.toLowerCase().includes(searchLower) ||
        ticket.purpose.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
    
    return {
      currentTickets,
      totalPages: Math.ceil(filteredTickets.length / itemsPerPage),
      totalItems: filteredTickets.length
    };
  };

  // Pagination handlers
  const handleNextPage = () => {
    const { totalPages } = getFilteredAndPaginatedTickets();
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Check if validate button should be enabled
  const canValidateTicket = (ticket) => {
    const isUpdating = validatingId === ticket.workflowId;
    const isPending = ticket.status === 'pending' || ticket.status === 'PENDING';
    const hasUserRole = userInfo && userInfo.userRole;
    return !isUpdating && isPending && hasUserRole;
  };

  // Handler functions
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleApplyFilters = () => {
    loadPendingApprovals();
    setCurrentPage(1);
  };

  const handleValidateClick = async (ticket) => {
    const currentUser = userInfo || await getCurrentUser();
    const actualRole = currentUser.userRole;
    
    const confirmed = window.confirm(
      `Approve this travel request?\n\n` +
      `Request ID: ${ticket.id}\n` +
      `Purpose: ${ticket.purpose}\n` +
      `Travel Dates: ${ticket.travelDates}\n` +
      `Approver: ${currentUser.userName} (${actualRole})\n` +
      `This will approve the request and move it forward.`
    );

    if (!confirmed) return;

    await handleValidate(ticket);
  };

  const handleViewDetails = (ticket) => {
    if (onTicketClick) {
      onTicketClick(ticket.originalData);
    } else {
      alert(`Travel Request Details:
Request ID: ${ticket.id}
Workflow ID: ${ticket.workflowId}
Purpose: ${ticket.purpose}
Travel Dates: ${ticket.travelDates}
Status: ${ticket.statusText}
Priority: ${ticket.priority}
Estimated Cost: ${ticket.estimatedCost}
Workflow Type: ${ticket.originalData.workflowType}
Employee: ${ticket.employee}
Department: ${ticket.department}`);
    }
  };

  const handleDebugRequest = async (ticket) => {
    try {
      const currentUser = userInfo || await getCurrentUser();
      const authStatus = checkAuthentication();
      
      alert(`🔍 Debug Information:
      
User: ${currentUser.userName}
User ID: ${currentUser.userId}
Actual Role: ${currentUser.userRole}
Email: ${currentUser.email}

Authentication:
- Token Present: ${authStatus.hasToken}
- Token Preview: ${authStatus.tokenPreview}
- LocalStorage Keys: ${authStatus.localStorageKeys.join(', ')}

Ticket: ${ticket.id}
Workflow: ${ticket.workflowId}

Request will use role: "${currentUser.userRole}"

Check browser console for full details.`);
      
    } catch (error) {
      alert(`Debug failed: ${error.message}`);
    }
  };

  const handleSetAuthToken = () => {
    const token = prompt('Enter the auth_token from Local Storage:');
    if (token) {
      localStorage.setItem('auth_token', token);
      alert('Auth token set in localStorage. Please refresh the page.');
      window.location.reload();
    }
  };

  // Utility functions for UI
  const getStatusClass = (status) => {
    const statusLower = status ? status.toLowerCase() : 'pending';
    switch (statusLower) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'in_progress': return 'status-validation';
      case 'completed': return 'status-approved';
      default: return 'status-pending';
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'high': return { class: 'urgency-high', text: 'High' };
      case 'medium': return { class: 'urgency-medium', text: 'Medium' };
      case 'low': return { class: 'urgency-low', text: 'Low' };
      default: return { class: 'urgency-medium', text: 'Medium' };
    }
  };

  // Render logic
  if (loading) {
    return (
      <div className="validation-queue">
        <div className="queue-header">
          <div className="header-content">
            <h2>Travel Request Validation Queue</h2>
            <p>Loading requests...</p>
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner"></div>
          <p>Connecting to travel desk system...</p>
        </div>
      </div>
    );
  }

  const { currentTickets, totalPages, totalItems } = getFilteredAndPaginatedTickets();
  const authStatus = checkAuthentication();
  const actualRole = userInfo?.userRole || 'Loading...';

  return (
    <div className="validation-queue">
      <div className="queue-header">
        <div className="header-content">
          <h2>Travel Request Validation Queue</h2>
          <p>{totalItems} requests pending approval</p>
          <div className="api-status">
            <strong>✅ LIVE API DATA</strong>
            {userInfo && ` - User: ${userInfo.userName}`}
            {userInfo && ` - Role: ${actualRole}`}
            {authStatus.hasToken ? ' - 🔐 Token: Present' : ' - 🔐 Token: Missing'}
            {error && ` - Error: ${error}`}
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => alert(`Auth Status:\nToken Present: ${authStatus.hasToken}\nToken: ${authStatus.tokenPreview}`)}
          >
            <i className="fas fa-shield-alt"></i>
            Check Auth
          </button>
          <button 
            className="btn btn-warning"
            onClick={handleSetAuthToken}
          >
            <i className="fas fa-key"></i>
            Set Token
          </button>
          <button 
            className="btn btn-primary"
            onClick={loadPendingApprovals}
            disabled={loading}
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <i className="fas fa-exclamation-triangle"></i>
          <div className="alert-content">
            <strong>Error Loading Data</strong>
            <p>{error}</p>
            <button className="btn btn-sm" onClick={loadPendingApprovals}>
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="filters">
        <div className="filter-item">
          <label htmlFor="status-filter">Status</label>
          <select 
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="PENDING">Pending Validation</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="search">Search</label>
          <input 
            type="text" 
            id="search"
            placeholder="Request ID, Employee..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>&nbsp;</label>
          <button className="btn btn-primary" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </div>
      </div>

      <div className="table-container">
        {currentTickets.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Employee</th>
                  <th>Travel Dates</th>
                  <th>Purpose</th>
                  <th>Estimated Cost</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTickets.map(ticket => {
                  const urgency = getUrgencyBadge(ticket.urgency);
                  const canValidate = canValidateTicket(ticket);
                  const isUpdating = validatingId === ticket.workflowId;
                  
                  return (
                    <tr key={ticket.workflowId} className={!canValidate ? 'row-disabled' : ''}>
                      <td>
                        <div className="ticket-id">
                          <span className="ticket-number">#{ticket.id}</span>
                          {ticket.urgency === 'high' && (
                            <i className="fas fa-exclamation-circle urgent-indicator" title="High Priority"></i>
                          )}
                        </div>
                      </td>
                      <td>{ticket.employee}</td>
                      <td>{ticket.travelDates}</td>
                      <td>{ticket.purpose}</td>
                      <td>{ticket.estimatedCost}</td>
                      <td>
                        <span className={`urgency-badge ${urgency.class}`}>
                          {urgency.text}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${getStatusClass(ticket.status)}`}>
                          {ticket.statusText}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className={`btn btn-success btn-sm ${!canValidate ? 'btn-disabled' : ''}`}
                            onClick={() => canValidate && handleValidateClick(ticket)}
                            disabled={!canValidate}
                          >
                            <i className={`fas fa-check ${isUpdating ? 'fa-spin' : ''}`}></i>
                            {isUpdating ? 'Approving...' : 'Approve'}
                          </button>
                          <button 
                            className="btn btn-info btn-sm"
                            onClick={() => handleViewDetails(ticket)}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="btn btn-warning btn-sm"
                            onClick={() => handleDebugRequest(ticket)}
                          >
                            <i className="fas fa-bug"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="btn btn-sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <i className="fas fa-chevron-left"></i>
                  Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="btn btn-sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <i className="fas fa-chevron-right"></i>
                </button>
                
                <div className="pagination-info">
                  Page {currentPage} of {totalPages} ({totalItems} total requests)
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <i className="fas fa-clipboard-list"></i>
            <h3>No pending requests</h3>
            <p>All travel requests have been processed or no requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationQueue;