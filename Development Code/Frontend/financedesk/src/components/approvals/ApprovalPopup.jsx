import {React} from 'react';
import './ApprovalPopups.css';

const ApprovalPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentRequest, 
  currentUser, 
  actionLoading 
}) => {
  if (!isOpen || !currentRequest) return null;

  return (
    <div className="popup-overlay">
      <div className="approval-popup">
        <div className="popup-header">
          <div className="popup-title">
            <div className="title-icon">✅</div>
            <h3>Confirm Approval</h3>
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
              <div className="info-item">
                <span className="info-label">Priority:</span>
                <span className={`priority-tag priority-${currentRequest.priority?.toLowerCase()}`}>
                  {currentRequest.priority}
                </span>
              </div>
            </div>
          </div>

          <div className="approver-info-section">
            <h4>Approver Details</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Approver:</span>
                <span className="info-value">{currentUser?.userName || currentUser?.fullName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role:</span>
                <span className="info-value role-badge">Finance</span>
              </div>
              <div className="info-item">
                <span className="info-label">User ID:</span>
                <span className="info-value">{currentUser?.userId}</span>
              </div>
            </div>
          </div>

          <div className="warning-section">
            <div className="warning-icon">⚠️</div>
            <div className="warning-content">
              <h5>Important Notice</h5>
              <p>This action cannot be undone. Once approved, the request will proceed to the next stage in the workflow.</p>
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
            className="btn btn-success"
            onClick={onConfirm}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <>
                <span className="spinner-mini"></span>
                Approving...
              </>
            ) : (
              <>
                <span className="btn-icon">✅</span>
                Confirm Approval
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPopup;