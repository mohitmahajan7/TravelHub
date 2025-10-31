import React from 'react';
import './PolicyExceptions.css';

const PolicyExceptions = () => {
  const exceptionRequests = [
    {
      id: 'TKT-2025-002',
      employee: 'Michael Chen (E1003)',
      department: 'Finance',
      type: 'Travel Request',
      policyIssue: 'Hotel cost exceeds policy limit due to conference venue',
      amount: 18200
    }
  ];

  const handleViewDetails = (requestId) => {
    console.log('View details:', requestId);
  };

  const handleApproveException = (requestId) => {
    if (window.confirm(`Approve policy exception for ${requestId}?`)) {
      console.log('Exception approved:', requestId);
    }
  };

  const handleReject = (requestId) => {
    if (window.confirm(`Reject request ${requestId}?`)) {
      console.log('Request rejected:', requestId);
    }
  };

  return (
    <div className="policy-exceptions">
      <h2 className="section-title">Policy Exceptions</h2>
      
      <div className="exceptions-card">
        <div className="card-header">
          <h3>Requests with Policy Violations</h3>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Type</th>
                <th>Policy Issue</th>
                <th>Amount (₹)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exceptionRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.employee}</td>
                  <td>{request.department}</td>
                  <td>{request.type}</td>
                  <td className="policy-issue">{request.policyIssue}</td>
                  <td>₹{request.amount.toLocaleString()}</td>
                  <td className="action-buttons">
                    <button 
                      className="icon-btn"
                      onClick={() => handleViewDetails(request.id)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button 
                      className="icon-btn success-btn"
                      onClick={() => handleApproveException(request.id)}
                      title="Approve Exception"
                    >
                      ✅
                    </button>
                    <button 
                      className="icon-btn danger-btn"
                      onClick={() => handleReject(request.id)}
                      title="Reject"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PolicyExceptions;