// PendingApprovals.jsx

import React, { useState } from 'react';
import { useFinanceApprovals } from '../../hooks/useFinanceApprovals.js';
import {
  formatDateTime,
  getDaysPending,
  getPriorityBadge,
  getStatusBadge,
  formatRequestDetails
} from '../../utils/financeApprovalUtils';
import ApprovalPopup from './ApprovalPopup';
import RejectionPopup from './RejectionPopup';
import './PendingApprovals.css';

// Enhanced debug component
const TokenDebugInfo = ({ currentUser }) => {
  const [debugInfo, setDebugInfo] = useState({});
  
  React.useEffect(() => {
    const gatherDebugInfo = () => {
      // Check all storage locations
      const userData = localStorage.getItem('user_data');
      let parsedUserData = null;
      try {
        parsedUserData = userData ? JSON.parse(userData) : null;
      } catch (e) {}

      const tokenInStorage = !!(
        (parsedUserData && (parsedUserData.token || parsedUserData.accessToken)) ||
        localStorage.getItem('auth_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken')
      );

      const tokenInCookies = document.cookie.includes('auth_token=') || document.cookie.includes('token=');

      setDebugInfo({
        tokenInStorage,
        tokenInCookies,
        userData: parsedUserData,
        hasUser: !!currentUser
      });
    };
    
    gatherDebugInfo();
  }, [currentUser]);
  
  return (
    <div className="debug-panel" style={{ 
      background: '#f0f8ff', 
      padding: '10px', 
      border: '1px solid #ccc',
      borderRadius: '5px',
      marginBottom: '15px',
      fontSize: '14px'
    }}>
      <details>
        <summary><strong>🔧 Authentication Status</strong></summary>
        <div style={{ marginTop: '10px' }}>
          <div><strong>Token Sources:</strong></div>
          <div>📍 LocalStorage: {debugInfo.tokenInStorage ? '✅ Found' : '❌ Missing'}</div>
          <div>🍪 Cookies: {debugInfo.tokenInCookies ? '✅ Found' : '❌ Missing'}</div>
          <div>👤 User Loaded: {debugInfo.hasUser ? '✅ Yes' : '❌ No'}</div>
          {currentUser && (
            <div>
              <div>🆔 User ID: {currentUser.userId}</div>
              <div>👤 Name: {currentUser.userName}</div>
              <div>🎯 Role: {currentUser.role}</div>
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

const PendingApprovals = () => {
  const {
    pendingRequests,
    loading,
    error,
    actionLoading,
    currentUser,
    refreshApprovals,
    executeApprove,
    executeReject
  } = useFinanceApprovals();

  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [showRejectionPopup, setShowRejectionPopup] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Handle approve action
  const handleApproveClick = (request) => {
    setCurrentRequest(request);
    setShowApprovalPopup(true);
  };

  // Handle reject action
  const handleRejectClick = (request) => {
    setCurrentRequest(request);
    setRejectionReason('');
    setShowRejectionPopup(true);
  };

  // Execute approve action - SIMPLIFIED
  const handleApprove = async () => {
    if (!currentRequest) return;

    try {
      console.log('🔄 Starting approval process...');
      await executeApprove(currentRequest);
      
      setShowApprovalPopup(false);
      
      // Show success message
      alert(`✅ Successfully Approved!\n\nRequest ID: ${currentRequest.travelRequestId}\nWorkflow ID: ${currentRequest.workflowId}`);
      
    } catch (error) {
      setShowApprovalPopup(false);
      
      console.error('❌ Approval error:', error);
      
      // User-friendly error messages
      let userMessage = error.message;
      if (error.message.includes('403')) {
        userMessage = 'Access Denied: You do not have permission to approve this request.';
      } else if (error.message.includes('401')) {
        userMessage = 'Authentication Failed: Please refresh the page and login again.';
      } else if (error.message.includes('500')) {
        userMessage = 'Server Error: Please contact technical support.';
      }
      
      alert(`❌ Approval Failed\n\n${userMessage}`);
    } finally {
      setCurrentRequest(null);
    }
  };

  // Execute reject action - SIMPLIFIED
  const handleReject = async () => {
    if (!currentRequest || !rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    try {
      console.log('🔄 Starting rejection process...');
      await executeReject(currentRequest, rejectionReason);
      
      setShowRejectionPopup(false);
      alert(`❌ Request Rejected!\n\nRequest ID: ${currentRequest.travelRequestId}\nReason: ${rejectionReason}`);
      
    } catch (error) {
      setShowRejectionPopup(false);
      
      console.error('❌ Rejection error:', error);
      
      let userMessage = error.message;
      if (error.message.includes('403')) {
        userMessage = 'Access Denied: You do not have permission to reject this request.';
      } else if (error.message.includes('401')) {
        userMessage = 'Authentication Failed: Please refresh the page and login again.';
      } else if (error.message.includes('500')) {
        userMessage = 'Server Error: Please contact technical support.';
      }
      
      alert(`❌ Rejection Failed\n\n${userMessage}`);
    } finally {
      setCurrentRequest(null);
      setRejectionReason('');
    }
  };

  const handleViewDetails = (request) => {
    alert(formatRequestDetails(request));
  };

  // Loading state
  if (loading) {
    return (
      <div className="pending-approvals">
        <h2 className="section-title">Pending Finance Approvals</h2>
        <div className="approvals-card">
          <div className="loading-spinner"></div>
          <p>Loading finance approvals...</p>
          <TokenDebugInfo currentUser={currentUser} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="pending-approvals">
        <h2 className="section-title">Pending Finance Approvals</h2>
        <div className="approvals-card error-state">
          <div className="error-message">
            <h3>❌ Error Loading Approvals</h3>
            <p>{error}</p>
            <button onClick={refreshApprovals} className="btn btn-primary">
              Retry
            </button>
          </div>
          <TokenDebugInfo currentUser={currentUser} />
        </div>
      </div>
    );
  }

  return (
    <div className="pending-approvals">
      <h2 className="section-title">Pending Finance Approvals</h2>
      
      <TokenDebugInfo currentUser={currentUser} />
      
      <div className="approvals-card">
        <div className="card-header">
          <h3>Travel Requests Awaiting Finance Approval</h3>
          <div className="header-info">
            <span className="live-badge">✅ LIVE DATA</span>
            {currentUser && (
              <span className="user-info">
                User: {currentUser.userName} ({currentUser.role})
              </span>
            )}
            <button 
              onClick={refreshApprovals} 
              className="btn btn-secondary btn-sm"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        <div className="table-container">
          {pendingRequests.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Workflow ID</th>
                  <th>Workflow Type</th>
                  <th>Current Step</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Days Pending</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(request => {
                  const priority = getPriorityBadge(request.priority);
                  const status = getStatusBadge(request.status);
                  const daysPending = getDaysPending(request.createdAt);
                  
                  return (
                    <tr key={request.workflowId}>
                      <td>
                        <div className="request-id" title={request.travelRequestId}>
                          {request.travelRequestId?.substring(0, 8)}...
                        </div>
                      </td>
                      <td>
                        <div className="workflow-id" title={request.workflowId}>
                          {request.workflowId.substring(0, 8)}...
                        </div>
                      </td>
                      <td>{request.workflowType}</td>
                      <td>{request.currentStep}</td>
                      <td>{formatDateTime(request.dueDate)}</td>
                      <td>
                        <span className={`priority-badge ${priority.class}`}>
                          {priority.text}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${status.class}`}>
                          {status.text}
                        </span>
                      </td>
                      <td>{daysPending}</td>
                      <td className="action-buttons">
                        <button 
                          className="icon-btn view-btn"
                          onClick={() => handleViewDetails(request)}
                          title="View Details"
                          disabled={actionLoading}
                        >
                          👁️
                        </button>
                        <button 
                          className="icon-btn approve-btn"
                          onClick={() => handleApproveClick(request)}
                          title="Approve Request"
                          disabled={actionLoading}
                        >
                          ✅
                        </button>
                        <button 
                          className="icon-btn reject-btn"
                          onClick={() => handleRejectClick(request)}
                          title="Reject Request"
                          disabled={actionLoading}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No pending finance approvals</h3>
              <p>All travel requests have been processed. New requests will appear here automatically.</p>
            </div>
          )}
        </div>

        {pendingRequests.length > 0 && (
          <div className="card-footer">
            <div className="summary-info">
              Showing {pendingRequests.length} request(s) requiring finance approval
              {actionLoading && ' - Processing action...'}
            </div>
          </div>
        )}
      </div>

      {/* Approval Confirmation Popup */}
      <ApprovalPopup
        isOpen={showApprovalPopup}
        onClose={() => setShowApprovalPopup(false)}
        onConfirm={handleApprove}
        currentRequest={currentRequest}
        currentUser={currentUser}
        actionLoading={actionLoading}
      />

      {/* Rejection Confirmation Popup */}
      <RejectionPopup
        isOpen={showRejectionPopup}
        onClose={() => setShowRejectionPopup(false)}
        onConfirm={handleReject}
        currentRequest={currentRequest}
        currentUser={currentUser}
        actionLoading={actionLoading}
        rejectionReason={rejectionReason}
        onRejectionReasonChange={setRejectionReason}
      />
    </div>
  );
};

export default PendingApprovals;