// src/components/user/Dashboard/Dashboard.jsx
import React from 'react';
import { 
  FaSuitcase, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle, 
  FaSave, 
  FaPlus, 
  FaList, 
  FaTasks, 
  FaEye,
  FaExclamationTriangle 
} from "react-icons/fa";
import { useDashboard } from '../../../hooks/useDashboard';

const Dashboard = ({ 
  onNavigate, 
  onViewRequest
}) => {
  const {
    requests,
    userProfile,
    loading,
    error,
    stats,
    getDisplayData
  } = useDashboard();

  const handleViewRequest = (requestId) => {
    if (onViewRequest) {
      onViewRequest(requestId);
    } else if (onNavigate) {
      onNavigate("request-detail", requestId);
    }
  };

  const handleNewRequest = () => {
    if (onNavigate) {
      onNavigate("new-request");
    }
  };

  const handleFilterRequests = (filter) => {
    if (onNavigate) {
      onNavigate("my-requests", filter);
    }
  };

  // Render loading state
  if (loading) {
    return <DashboardLoading />;
  }

  // Render error state
  if (error) {
    return <DashboardError error={error} onRetry={() => window.location.reload()} />;
  }

  const displayData = getDisplayData();

  return (
    <div className="content">
      <DashboardHeader userProfile={userProfile} />
      
      <KPICards stats={stats} onFilter={handleFilterRequests} />
      
      <RecentRequests 
        displayData={displayData}
        onNewRequest={handleNewRequest}
        onViewRequest={handleViewRequest}
      />
      
      <QuickActions 
        displayData={displayData}
        onNewRequest={handleNewRequest}
        onFilterRequests={handleFilterRequests}
        onViewRequest={handleViewRequest}
      />
    </div>
  );
};

// Sub-components for better organization
const DashboardLoading = () => (
  <div className="content">
    <div className="detailHeader">
      <div>
        <h2>User Dashboard</h2>
        <p>Loading your dashboard...</p>
      </div>
    </div>
    <div className="card">
      <div className="cardBody" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    </div>
  </div>
);

const DashboardError = ({ error, onRetry }) => (
  <div className="content">
    <div className="detailHeader">
      <div>
        <h2>User Dashboard</h2>
        <p>Error loading dashboard</p>
      </div>
    </div>
    <div className="card">
      <div className="cardBody" style={{ textAlign: 'center', padding: '40px' }}>
        <FaExclamationTriangle style={{ fontSize: '3rem', color: '#dc3545', marginBottom: '15px' }} />
        <h4 style={{ color: '#dc3545', marginBottom: '10px' }}>Unable to Load Dashboard</h4>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>
          {error || 'An unexpected error occurred while loading your dashboard.'}
        </p>
        <button 
          className="btn btnPrimary" 
          onClick={onRetry}
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

const DashboardHeader = ({ userProfile }) => (
  <div className="detailHeader">
    <div>
      <h2>User Dashboard</h2>
      <p>Welcome to your Travel Management System dashboard</p>
      {userProfile && (
        <p style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '5px' }}>
          Showing data for: {userProfile.email} (User ID: {userProfile.userId})
        </p>
      )}
    </div>
  </div>
);

const KPICards = ({ stats, onFilter }) => {
  const statConfigs = [
    { 
      key: 'all', 
      label: 'My Requests', 
      icon: FaSuitcase, 
      className: 'total', 
      value: stats.total,
      description: 'Total travel requests'
    },
    { 
      key: 'approved', 
      label: 'Approved', 
      icon: FaCheckCircle, 
      className: 'approved', 
      value: stats.approved,
      description: 'Approved requests'
    },
    { 
      key: 'pending', 
      label: 'Pending', 
      icon: FaClock, 
      className: 'pending', 
      value: stats.pending,
      description: 'Pending approval'
    },
    { 
      key: 'rejected', 
      label: 'Rejected', 
      icon: FaTimesCircle, 
      className: 'rejected', 
      value: stats.rejected,
      description: 'Rejected requests'
    },
    { 
      key: 'draft', 
      label: 'Drafts', 
      icon: FaSave, 
      className: 'draft', 
      value: stats.draft,
      description: 'Draft requests'
    }
  ];

  return (
    <div className="statsContainer">
      {statConfigs.map(({ key, label, icon: Icon, className, value, description }) => (
        <div 
          key={key}
          className={`statCard ${value > 0 ? 'clickable' : ''}`}
          onClick={() => value > 0 && onFilter(key)}
          style={{ cursor: value > 0 ? 'pointer' : 'default' }}
        >
          <div className={`statIcon ${className}`}>
            <Icon className="statIconSvg" />
          </div>
          <div className="statInfo">
            <h3>{value}</h3>
            <p>{label}</p>
            <small style={{ color: '#6c757d', fontSize: '0.8em' }}>{description}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

const RecentRequests = ({ displayData, onNewRequest, onViewRequest }) => (
  <div className="card">
    <div className="cardHeaderFlex">
      <div>
        <h3>Recent Travel Requests</h3>
        <p style={{ fontSize: '0.9em', color: '#6c757d', margin: 0 }}>
          Your most recent {displayData.length} travel requests
        </p>
      </div>
      <button className="btn btnPrimary" onClick={onNewRequest}>
        <FaPlus className="btnIconSvg" /> New Request
      </button>
    </div>
    <div className="cardBody">
      {displayData.length > 0 ? (
        <div className="table-responsive">
          <table className="requests-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Purpose</th>
                <th>Dates</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((request) => (
                <RequestRow 
                  key={request.id} 
                  request={request} 
                  onViewRequest={onViewRequest} 
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState onNewRequest={onNewRequest} />
      )}
    </div>
  </div>
);

const RequestRow = ({ request, onViewRequest }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { class: 'approved', text: 'Approved' },
      pending: { class: 'pending', text: 'Pending' },
      rejected: { class: 'rejected', text: 'Rejected' },
      draft: { class: 'draft', text: 'Draft' },
      submitted: { class: 'pending', text: 'Submitted' },
      completed: { class: 'approved', text: 'Completed' }
    };

    const config = statusConfig[status] || { class: 'draft', text: 'Unknown' };
    
    return (
      <span className={`status ${config.class}`}>
        {config.text}
      </span>
    );
  };

  return (
    <tr className="clickableRow">
      <td>
        <strong>#{request.id}</strong>
      </td>
      <td>
        <div>
          <div style={{ fontWeight: '500' }}>{request.destination}</div>
          {request.purpose && (
            <small style={{ color: '#6c757d', fontSize: '0.85em' }}>
              {request.purpose}
            </small>
          )}
        </div>
      </td>
      <td>
        <div style={{ fontSize: '0.9em' }}>
          <div>{request.dates}</div>
        </div>
      </td>
      <td>
        <span style={{ 
          backgroundColor: '#e9ecef', 
          padding: '4px 8px', 
          borderRadius: '12px', 
          fontSize: '0.85em',
          fontWeight: '500'
        }}>
          {request.duration} day{request.duration !== 1 ? 's' : ''}
        </span>
      </td>
      <td>
        {getStatusBadge(request.status)}
      </td>
      <td>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btnIcon"
            onClick={() => onViewRequest(request.id)}
            title="View Details"
            style={{ 
              backgroundColor: '#007bff', 
              color: 'white',
              padding: '6px 10px',
              borderRadius: '4px'
            }}
          >
            <FaEye className="btnIconSvg" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const EmptyState = ({ onNewRequest }) => (
  <div className="emptyState" style={{ textAlign: 'center', padding: '60px 40px' }}>
    <FaSuitcase style={{ fontSize: '4rem', color: '#dee2e6', marginBottom: '20px' }} />
    <h4 style={{ color: '#6c757d', marginBottom: '10px' }}>No travel requests yet</h4>
    <p style={{ color: '#6c757d', marginBottom: '25px' }}>
      You haven't created any travel requests yet. Get started by creating your first request.
    </p>
    <button 
      className="btn btnPrimary" 
      onClick={onNewRequest} 
      style={{ 
        padding: '12px 24px',
        fontSize: '1rem'
      }}
    >
      <FaPlus className="btnIconSvg" /> Create Your First Request
    </button>
  </div>
);

const QuickActions = ({ displayData, onNewRequest, onFilterRequests, onViewRequest }) => {
  const quickActions = [
    {
      key: 'new-request',
      label: 'New Travel Request',
      description: 'Create a new travel request',
      icon: FaPlus,
      iconClass: 'blue',
      onClick: onNewRequest,
      disabled: false
    },
    {
      key: 'view-requests',
      label: 'View My Requests',
      description: 'See all your travel requests',
      icon: FaList,
      iconClass: 'green',
      onClick: () => onFilterRequests("all"),
      disabled: false
    },
    {
      key: 'track-approval',
      label: 'Track Approval',
      description: 'Monitor request status',
      icon: FaTasks,
      iconClass: 'purple',
      onClick: () => displayData.length > 0 && onViewRequest(displayData[0].id),
      disabled: displayData.length === 0
    }
  ];

  return (
    <div className="card">
      <div className="cardHeader">
        <h3>Quick Actions</h3>
        <p style={{ fontSize: '0.9em', color: '#6c757d', margin: '5px 0 0 0' }}>
          Quickly access common tasks
        </p>
      </div>
      <div className="cardBody">
        <div className="quickActionGrid">
          {quickActions.map((action) => (
            <button 
              key={action.key}
              onClick={action.onClick}
              className="quickActionBtn"
              disabled={action.disabled}
              style={{ 
                opacity: action.disabled ? 0.6 : 1,
                cursor: action.disabled ? 'not-allowed' : 'pointer'
              }}
            >
              <div className={`quickActionIcon ${action.iconClass}`}>
                <action.icon className="quickActionSvg" />
              </div>
              <div className="quickActionContent">
                <span style={{ fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                  {action.label}
                </span>
                <small style={{ color: '#6c757d', fontSize: '0.85em' }}>
                  {action.description}
                </small>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;