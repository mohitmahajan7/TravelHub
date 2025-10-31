// src/components/user/RequestDetail/RequestDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const RequestDetail = ({ onBack }) => {
  const { requestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [dataSource, setDataSource] = useState('navigation'); // 'api' or 'navigation'

  console.log('🎉 [RequestDetail] COMPONENT IS RENDERING!');
  console.log('📋 Request ID:', requestId);
  console.log('📍 Location state:', location.state);

  // Hit the API via proxy to get complete request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 [RequestDetail] Fetching from API via proxy...');
        
        // Use relative URL - the proxy will handle forwarding to the actual API
        const apiUrl = `/travel-management/api/travel-requests/${requestId}`;
        console.log('🔍 [RequestDetail] Proxy API URL:', apiUrl);
        console.log('🔍 [RequestDetail] Full URL will be:', window.location.origin + apiUrl);
        
        const token = localStorage.getItem('auth_token');
        console.log('🔍 [RequestDetail] Auth token present:', !!token);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        console.log('📊 [RequestDetail] API Response status:', response.status);
        console.log('📊 [RequestDetail] API Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [RequestDetail] API error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ [RequestDetail] API data received:', data);
        
        setApiData(data);
        setDataSource('api');
        
      } catch (err) {
        console.error('❌ [RequestDetail] API fetch error:', err);
        setError(err.message);
        
        // Fallback to navigation state data if API fails
        if (location.state?.request) {
          console.log('🔄 [RequestDetail] Falling back to navigation state data');
          setRequest(location.state.request);
          setDataSource('navigation');
        }
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      console.log('🚀 [RequestDetail] Starting API call via proxy...');
      fetchRequestDetails();
    }
  }, [requestId, location.state]);

  // Use API data if available, otherwise use navigation state data
  useEffect(() => {
    if (apiData) {
      console.log('✅ [RequestDetail] Using API data:', apiData);
      setRequest(apiData);
    } else if (location.state?.request && !apiData) {
      console.log('✅ [RequestDetail] Using navigation state data');
      setRequest(location.state.request);
    }
  }, [apiData, location.state]);

  const handleGoBack = () => {
    console.log('🔙 Going back to My Requests');
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button 
            onClick={handleGoBack}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back to Requests
          </button>
          <div>
            <h1 style={{ color: '#007bff', margin: 0 }}>Loading Request Details...</h1>
          </div>
        </div>

        <div style={{
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px auto'
          }}></div>
          <p>Fetching complete travel request details via proxy...</p>
          <p style={{ fontSize: '0.9em', color: '#6c757d', marginTop: '10px' }}>
            Request ID: {requestId}
          </p>
          <p style={{ fontSize: '0.8em', color: '#6c757d' }}>
            Proxy URL: /travel-management/api/travel-requests/{requestId}
          </p>
          <p style={{ fontSize: '0.8em', color: '#6c757d' }}>
            Target: http://bwc-97.brainwaveconsulting.co.in:8090/travel-management/api/travel-requests/{requestId}
          </p>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <button 
            onClick={handleGoBack}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back to Requests
          </button>
          <div>
            <h1 style={{ color: '#dc3545', margin: 0 }}>API Error</h1>
          </div>
        </div>

        <div style={{
          padding: '30px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '15px' }}>❌</div>
          <h3>Failed to Load Request Details</h3>
          <p style={{ marginBottom: '20px' }}>{error}</p>
          <p style={{ fontSize: '0.9em', color: '#721c24', marginBottom: '20px' }}>
            Request ID: {requestId}
          </p>
          <p style={{ fontSize: '0.8em', color: '#721c24', marginBottom: '20px' }}>
            Proxy URL: /travel-management/api/travel-requests/{requestId}
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={handleGoBack} style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Back to My Requests
            </button>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const dataSourceColor = dataSource === 'api' ? '#28a745' : '#ffc107';
  const dataSourceBg = dataSource === 'api' ? '#d4edda' : '#fff3cd';
  const dataSourceBorder = dataSource === 'api' ? '#c3e6cb' : '#ffeaa7';

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={handleGoBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to Requests
        </button>
        {/* <div>
          <h1 style={{ color: '#28a745', margin: 0 }}>✅ Travel Request Details</h1>
          <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>
            Request ID: {requestId} | Data Source: <span style={{ color: dataSourceColor, fontWeight: 'bold' }}>{dataSource.toUpperCase()}</span>
          </p>
        </div> */}
      </div>

      {/* Data Source Info */}
      {/* <div style={{
        padding: '15px',
        backgroundColor: dataSourceBg,
        color: dataSource === 'api' ? '#155724' : '#856404',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `1px solid ${dataSourceBorder}`
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {dataSource === 'api' ? '🎉 Complete data loaded from API via proxy!' : 'ℹ️ Using data from navigation state'}
        </p>
        {dataSource === 'api' && (
          <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
            Proxy: /travel-management/api/travel-requests/{requestId} → http://bwc-97.brainwaveconsulting.co.in:8090/travel-management/api/travel-requests/{requestId}
          </p>
        )}
      </div> */}

      {/* Request Data */}
      {request && (
        <>
          {/* Basic Information Card */}
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              <div>
                <strong>Request ID:</strong> {request.travelRequestId}
              </div>
              <div>
                <strong>Employee ID:</strong> {request.employeeId}
              </div>
              <div>
                <strong>Project ID:</strong> {request.projectId}
              </div>
              <div>
                <strong>Purpose:</strong> {request.purpose}
              </div>
            </div>
          </div>

          {/* Travel Dates Card */}
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3>Travel Dates</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <strong>Start Date:</strong> {formatDate(request.startDate)}
              </div>
              <div>
                <strong>End Date:</strong> {formatDate(request.endDate)}
              </div>
              <div>
                <strong>Duration:</strong> {calculateDuration(request.startDate, request.endDate)} days
              </div>
              <div>
                <strong>Date Validation:</strong> 
                <span style={{ 
                  color: request.endDateAfterStartDate ? '#28a745' : '#dc3545',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {request.endDateAfterStartDate ? '✓ Valid' : '✗ Invalid'}
                </span>
              </div>
            </div>
          </div>

          {/* Management Information Card */}
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3>Management Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <strong>Manager Present:</strong>
                <span style={{ 
                  color: request.managerPresent ? '#28a745' : '#6c757d',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {request.managerPresent ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            </div>
          </div>

          {/* System Information Card */}
          <div style={{
            padding: '20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3>System Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              <div>
                <strong>Created Date:</strong> {formatDateTime(request.createdAt)}
              </div>
              <div>
                <strong>Last Updated:</strong> {formatDateTime(request.updatedAt)}
              </div>
            </div>
          </div>

          {/* Raw Data */}
          <div style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3>Raw Data ({dataSource})</h3>
            <details>
              <summary>View Complete Data</summary>
              <pre style={{ 
                background: '#2d3748', 
                color: '#e2e8f0',
                padding: '15px', 
                borderRadius: '4px', 
                overflow: 'auto', 
                fontSize: '12px',
                marginTop: '10px',
                maxHeight: '400px'
              }}>
                {JSON.stringify(request, null, 2)}
              </pre>
            </details>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleGoBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back to My Requests
        </button>
        <button 
          onClick={() => navigate('/my-requests')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📋 View All Requests
        </button>
      </div>
    </div>
  );
};

export default RequestDetail;