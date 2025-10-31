import React from 'react';
import './Reimbursements.css';

const Reimbursements = () => {
  const reimbursementRequests = [
    {
      id: 'REIM-2025-001',
      employee: 'Sarah Johnson (E1002)',
      department: 'Engineering',
      travelDates: '2025-09-10 to 2025-09-12',
      purpose: 'Technical Training',
      amount: 8400,
      approvedDate: '2025-09-14'
    }
  ];

  const handleProcessPayment = (reimbursementId) => {
    if (window.confirm(`Process payment for ${reimbursementId}?`)) {
      console.log('Payment processed:', reimbursementId);
    }
  };

  const handleProcessBatchPayments = () => {
    if (window.confirm('Process batch payments for all reimbursements?')) {
      console.log('Batch payments processed');
    }
  };

  return (
    <div className="reimbursements">
      <h2 className="section-title">Pending Reimbursements</h2>
      
      <div className="reimbursements-card">
        <div className="card-header">
          <h3>Reimbursements Ready for Payment</h3>
          <button 
            className="process-batch-btn"
            onClick={handleProcessBatchPayments}
          >
            <i className="fas fa-money-bill-wave"></i>
            Process Batch Payments
          </button>
        </div>
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reimbursement ID</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Travel Dates</th>
                <th>Purpose</th>
                <th>Amount (₹)</th>
                <th>Approved Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reimbursementRequests.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.employee}</td>
                  <td>{request.department}</td>
                  <td>{request.travelDates}</td>
                  <td>{request.purpose}</td>
                  <td>₹{request.amount.toLocaleString()}</td>
                  <td>{request.approvedDate}</td>
                  <td>
                    <button 
                      className="process-payment-btn"
                      onClick={() => handleProcessPayment(request.id)}
                    >
                      <i className="fas fa-check"></i>
                      Process Payment
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

export default Reimbursements;