import React from 'react';
import './ApprovalPopups.css';

const RejectionPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentRequest, 
  currentUser, 
  actionLoading,
  rejectionReason,
  onRejectionReasonChange
}) => {
  if (!isOpen || !currentRequest) return null;

  const isReasonValid = rejectionReason.trim().length >= 10; // Minimum 10 characters

  return (
    <div className="popup-overlay">
      <div className="approval-popup rejection-popup">
        <div className="popup-header">
          <div className="popup-title">
            <div className="title-icon">❌</div>
            <h3>Confirm Rejection</h3>
          </div>
          <button 
            className="close-btn"
            onClick={onClose}
            disabled={actionLoading}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="popup-content">
          <div className="request-info-section">
            <h4>Request Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Request ID:</span>
                <span className="info-value">{currentRequest.travelRequestId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Workflow ID:</span>
                <span className="info-value">{currentRequest.workflowId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Current Step:</span>
                <span className="info-value">{currentRequest.currentStep}</span>
              </div>
            </div>
          </div>

          <div className="approver-info-section">
            <h4>Rejecting As</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">User:</span>
                <span className="info-value">{currentUser?.userName || currentUser?.fullName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role:</span>
                <span className="info-value role-badge">Finance</span>
              </div>
            </div>
          </div>

          <div className="rejection-reason-section">
            <label htmlFor="rejectionReason" className="reason-label">
              Rejection Reason *
            </label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              placeholder="Please provide a detailed reason for rejection. This will be shared with the requester..."
              rows="4"
              disabled={actionLoading}
              className={`reason-textarea ${!isReasonValid && rejectionReason ? 'error' : ''}`}
            />
            <div className="reason-validation">
              {!isReasonValid && rejectionReason && (
                <span className="validation-error">
                  ❌ Reason must be at least 10 characters long
                </span>
              )}
              {rejectionReason && (
                <span className="character-count">
                  {rejectionReason.length} characters
                </span>
              )}
            </div>
          </div>

          <div className="warning-section">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <h5>Important Notice</h5>
              <p>This action cannot be undone. The requester will be notified of the rejection with the reason provided.</p>
            </div>
          </div>
        </div>

        <div className="popup-actions">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
            disabled={actionLoading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={actionLoading || !rejectionReason.trim() || !isReasonValid}
            title={!isReasonValid ? "Please provide a detailed rejection reason (min. 10 characters)" : ""}
          >
            {actionLoading ? (
              <>
                <span className="spinner-mini"></span>
                Rejecting...
              </>
            ) : (
              <>
                <span className="btn-icon">❌</span>
                Confirm Rejection
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionPopup;