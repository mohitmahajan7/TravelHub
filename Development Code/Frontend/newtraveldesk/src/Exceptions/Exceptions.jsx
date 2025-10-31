import React, { useState } from 'react';
import './Exceptions.css';

const Exceptions = ({ onTicketClick }) => {
  const [filters, setFilters] = useState({
    status: 'all',
    exceptionType: 'all',
    travelDate: '',
    search: ''
  });

  // Mock data for exceptions
  const exceptionTickets = [
    {
      id: 'TT-2023-0877',
      employee: 'Priya Sharma',
      employeeId: 'E10235',
      department: 'Marketing',
      travelDates: '17 Sep - 20 Sep 2023',
      destination: 'Bangalore',
      estimatedCost: '₹18,700',
      status: 'hr-approved',
      statusText: 'HR Approved',
      exceptionType: 'cost-exceeded',
      exceptionTypeText: 'Cost Exceeds Policy',
      hrApproval: 'approved',
      financeApproval: 'pending',
      priority: 'high',
      policyLimit: '₹15,000',
      excessAmount: '₹3,700',
      justification: 'Product launch event requires premium accommodation'
    },
    {
      id: 'TT-2023-0880',
      employee: 'Vikram Singh',
      employeeId: 'E10238',
      department: 'Operations',
      travelDates: '22 Sep - 25 Sep 2023',
      destination: 'Hyderabad',
      estimatedCost: '₹21,300',
      status: 'finance-approved',
      statusText: 'Finance Approved',
      exceptionType: 'accommodation',
      exceptionTypeText: 'Premium Accommodation',
      hrApproval: 'approved',
      financeApproval: 'approved',
      priority: 'medium',
      policyLimit: '₹18,000',
      excessAmount: '₹3,300',
      justification: 'Client meeting at 5-star hotel venue'
    },
    {
      id: 'TT-2023-0891',
      employee: 'Rohit Malhotra',
      employeeId: 'E10249',
      department: 'Sales',
      travelDates: '12 Oct - 15 Oct 2023',
      destination: 'Mumbai',
      estimatedCost: '₹25,800',
      status: 'pending',
      statusText: 'Pending HR Approval',
      exceptionType: 'cost-exceeded',
      exceptionTypeText: 'Cost Exceeds Policy',
      hrApproval: 'pending',
      financeApproval: 'pending',
      priority: 'high',
      policyLimit: '₹20,000',
      excessAmount: '₹5,800',
      justification: 'Executive client meeting with C-level stakeholders'
    },
    {
      id: 'TT-2023-0892',
      employee: 'Anjali Mehta',
      employeeId: 'E10250',
      department: 'Engineering',
      travelDates: '18 Oct - 20 Oct 2023',
      destination: 'Delhi',
      estimatedCost: '₹14,500',
      status: 'hr-approved',
      statusText: 'HR Approved',
      exceptionType: 'travel-class',
      exceptionTypeText: 'Business Class Travel',
      hrApproval: 'approved',
      financeApproval: 'pending',
      priority: 'medium',
      policyLimit: 'Economy Class',
      excessAmount: '₹4,200',
      justification: 'Medical condition requires extra leg room'
    },
    {
      id: 'TT-2023-0893',
      employee: 'Sanjay Reddy',
      employeeId: 'E10251',
      department: 'Finance',
      travelDates: '25 Oct - 28 Oct 2023',
      destination: 'Chennai',
      estimatedCost: '₹16,200',
      status: 'rejected',
      statusText: 'Rejected by HR',
      exceptionType: 'cost-exceeded',
      exceptionTypeText: 'Cost Exceeds Policy',
      hrApproval: 'rejected',
      financeApproval: 'pending',
      priority: 'low',
      policyLimit: '₹15,000',
      excessAmount: '₹1,200',
      justification: 'Training program attendance'
    },
    {
      id: 'TT-2023-0894',
      employee: 'Neha Kapoor',
      employeeId: 'E10252',
      department: 'HR',
      travelDates: '02 Nov - 05 Nov 2023',
      destination: 'Pune',
      estimatedCost: '₹19,800',
      status: 'pending',
      statusText: 'Pending HR Approval',
      exceptionType: 'accommodation',
      exceptionTypeText: 'Extended Stay',
      hrApproval: 'pending',
      financeApproval: 'pending',
      priority: 'medium',
      policyLimit: '3 nights max',
      excessAmount: '1 extra night',
      justification: 'Recruitment drive requires additional day'
    }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    console.log('Filters applied:', filters);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'hr-approved': return 'status-hr';
      case 'finance-approved': return 'status-finance';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const getExceptionTypeClass = (exceptionType) => {
    switch (exceptionType) {
      case 'cost-exceeded': return 'exception-type-cost';
      case 'accommodation': return 'exception-type-accommodation';
      case 'travel-class': return 'exception-type-travel-class';
      default: return 'exception-type-other';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return { class: 'priority-high', text: 'High', icon: 'fas fa-exclamation-circle' };
      case 'medium': return { class: 'priority-medium', text: 'Medium', icon: 'fas fa-info-circle' };
      case 'low': return { class: 'priority-low', text: 'Low', icon: 'fas fa-flag' };
      default: return { class: 'priority-medium', text: 'Medium', icon: 'fas fa-info-circle' };
    }
  };

  const getApprovalStatus = (ticket) => {
    if (ticket.hrApproval === 'rejected') return 'Rejected';
    if (ticket.financeApproval === 'approved') return 'Finance Approved';
    if (ticket.hrApproval === 'approved') return 'HR Approved';
    return 'Pending HR Approval';
  };

  const handleEscalate = (ticketId) => {
    console.log('Escalating ticket:', ticketId);
    // Escalation logic would go here
  };

  const handleApprove = (ticketId) => {
    console.log('Approving ticket:', ticketId);
    // Approval logic would go here
  };

  const exceptionStats = {
    total: exceptionTickets.length,
    pending: exceptionTickets.filter(t => t.status === 'pending').length,
    approved: exceptionTickets.filter(t => t.status === 'hr-approved' || t.status === 'finance-approved').length,
    rejected: exceptionTickets.filter(t => t.status === 'rejected').length
  };
  

  return (
    <div className="exceptions">
      <div className="exceptions-header">
        <div className="header-content">
          <h2>Policy Exceptions</h2>
          <p>Manage travel requests that require policy exceptions</p>
          <div className="exception-stats">
            <div className="stat-card total">
              <div className="stat-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="stat-info">
                <div className="stat-number">{exceptionStats.total}</div>
                <div className="stat-label">Total Exceptions</div>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <div className="stat-number">{exceptionStats.pending}</div>
                <div className="stat-label">Pending Approval</div>
              </div>
            </div>
            <div className="stat-card approved">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <div className="stat-number">{exceptionStats.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-icon">
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-info">
                <div className="stat-number">{exceptionStats.rejected}</div>
                <div className="stat-label">Rejected</div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>

      <div className="filters">
        <div className="filter-item">
          <label htmlFor="status-filter">Approval Status</label>
          <select 
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending HR Approval</option>
            <option value="hr-approved">HR Approved</option>
            <option value="finance-approved">Finance Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="exception-type">Exception Type</label>
          <select 
            id="exception-type"
            value={filters.exceptionType}
            onChange={(e) => handleFilterChange('exceptionType', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="cost-exceeded">Cost Exceeds Policy</option>
            <option value="accommodation">Accommodation Exception</option>
            <option value="travel-class">Travel Class Exception</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="date-filter">Travel Date</label>
          <input 
            type="date" 
            id="date-filter"
            value={filters.travelDate}
            onChange={(e) => handleFilterChange('travelDate', e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="search">Search</label>
          <input 
            type="text" 
            id="search"
            placeholder="Ticket ID, Employee, Exception Type..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-item" style={{justifyContent: 'flex-end'}}>
          <label>&nbsp;</label>
          <button className="btn btn-primary" onClick={applyFilters}>
            <i className="fas fa-filter"></i> Apply Filters
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Employee</th>
              <th>Department</th>
              <th>Travel Dates</th>
              <th>Destination</th>
              <th>Exception Type</th>
              <th>Policy Limit</th>
              <th>Excess Amount</th>
              <th>Priority</th>
              <th>Approval Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exceptionTickets.map(ticket => {
              const priority = getPriorityBadge(ticket.priority);
              const approvalStatus = getApprovalStatus(ticket);
              
              return (
                <tr key={ticket.id} className={`exception-row ${ticket.status}`}>
                  <td>
                    <div className="ticket-id">
                      <span>#{ticket.id}</span>
                      {ticket.priority === 'high' && (
                        <i className="fas fa-exclamation-circle urgent-indicator"></i>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="employee-info">
                      <div className="employee-name">{ticket.employee}</div>
                      <div className="employee-id">{ticket.employeeId}</div>
                    </div>
                  </td>
                  <td>{ticket.department}</td>
                  <td>{ticket.travelDates}</td>
                  <td>
                    <div className="destination">
                      <i className="fas fa-map-marker-alt"></i>
                      {ticket.destination}
                    </div>
                  </td>
                  <td>
                    <span className={`exception-type-badge ${getExceptionTypeClass(ticket.exceptionType)}`}>
                      <i className="fas fa-info-circle"></i>
                      {ticket.exceptionTypeText}
                    </span>
                  </td>
                  <td>
                    <div className="policy-limit">
                      <span className="limit-value">{ticket.policyLimit}</span>
                    </div>
                  </td>
                  <td>
                    <div className="excess-amount">
                      <span className={`amount ${ticket.exceptionType === 'cost-exceeded' ? 'cost-excess' : 'other-excess'}`}>
                        {ticket.excessAmount}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`priority-badge ${priority.class}`}>
                      <i className={priority.icon}></i>
                      {priority.text}
                    </span>
                  </td>
                  <td>
                    <div className="approval-status">
                      <span className={`status ${getStatusClass(ticket.status)}`}>
                        {approvalStatus}
                      </span>
                      <div className="approval-progress">
                        <div className={`progress-step ${ticket.hrApproval === 'approved' ? 'completed' : ticket.hrApproval === 'rejected' ? 'rejected' : ''}`}>
                          HR
                        </div>
                        <div className={`progress-step ${ticket.financeApproval === 'approved' ? 'completed' : ticket.financeApproval === 'rejected' ? 'rejected' : ''}`}>
                          Finance
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {ticket.financeApproval === 'approved' ? (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => onTicketClick(ticket)}
                        >
                          <i className="fas fa-calendar-check"></i>
                          Book
                        </button>
                      ) : (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => onTicketClick(ticket)}
                        >
                          <i className="fas fa-eye"></i>
                          Review
                        </button>
                      )}
                      
                      {ticket.status === 'pending' && (
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEscalate(ticket.id)}
                        >
                          <i className="fas fa-flag"></i>
                        </button>
                      )}
                      
                      <button className="btn btn-outline btn-sm">
                        <i className="fas fa-comment"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="page-btn">
          <i className="fas fa-chevron-left"></i>
        </div>
        <div className="page-btn active">1</div>
        <div className="page-btn">2</div>
        <div className="page-btn">3</div>
        <div className="page-btn">
          <i className="fas fa-chevron-right"></i>
        </div>
      </div>

      {exceptionTickets.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-check-circle"></i>
          <h3>No Policy Exceptions</h3>
          <p>All travel requests are within policy limits. New exceptions will appear here when detected.</p>
        </div>
      )}
    </div>
  );
};

export default Exceptions;