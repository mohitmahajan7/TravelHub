import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import NewRequest from './component/user/NewRequest/NewRequests.jsx';
import MyRequests from './component/user/MyRequests/MyRequests.jsx';
import Profile from './component/user/Profile/Profile.jsx';
import RequestDetail from './component/user/MyRequests/RequestDetail.jsx';
import Dashboard from './component/user/Dashboard/Dashboard.jsx';
import Layout from './component/common/Layout/Layout.jsx';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  console.log('🔍 [App] Current location:', location.pathname);
  console.log('🔍 [App] Current route params:', location.state);

  const user = {
    name: 'John Doe',
    role: 'User',
    avatar: '/path/to/avatar.jpg'
  };

  const handleNavigate = (route) => {
    try {
      console.log('🔄 [App] Navigating to:', route);
      navigate(route);
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 992) {
        setSidebarOpen(false);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const handleBack = () => {
    try {
      console.log('🔙 [App] Going back');
      navigate(-1);
    } catch (error) {
      console.error('Back navigation error:', error);
      navigate('/dashboard'); // Fallback to dashboard
    }
  };

  // Default navigation items
  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/new-request', label: 'New Request', icon: 'add' },
    { path: '/my-requests', label: 'My Requests', icon: 'list' },
    { path: '/profile', label: 'Profile', icon: 'person' }
  ];

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      onSidebarToggle={setSidebarOpen}
      activeContent={location.pathname}
      onNavigate={handleNavigate}
      user={user}
      navigationItems={navigationItems}
      canGoBack={location.pathname !== '/dashboard' && location.pathname !== '/'}
      onBack={handleBack}
    >
      <Routes>
        <Route path="/" element={
          <Dashboard
            onNavigate={handleNavigate}
          />
        } />

        <Route path="/dashboard" element={
          <Dashboard
            onNavigate={handleNavigate}
          />
        } />

        <Route path="/new-request" element={
          <NewRequest
            onNavigate={handleNavigate}
          />
        } />

        <Route path="/my-requests" element={
          <MyRequests
            onNavigate={handleNavigate}
            onRequestClick={(requestId) => {
              console.log('🔄 [App] MyRequests onRequestClick:', requestId);
              navigate(`/request-detail/${requestId}`);
            }}
          />
        } />

        <Route path="/request-detail/:requestId" element={
          <RequestDetail
            onBack={() => {
              console.log('🔙 [App] RequestDetail back clicked');
              navigate(-1);
            }}
          />
        } />

        <Route path="/profile" element={
          <Profile
            user={user}
            onNavigate={handleNavigate}
          />
        } />

        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

// Main App component with Error Boundary
const App = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;