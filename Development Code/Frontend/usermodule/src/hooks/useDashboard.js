// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';

export const useDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    draft: 0
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🚀 Initializing dashboard...');
        
        // Fetch user profile
        const profile = await dashboardService.fetchUserProfile();
        setUserProfile(profile);
        console.log('✅ User profile loaded:', profile);

        // Fetch travel requests
        const allRequests = await dashboardService.fetchTravelRequests();
        console.log('✅ Travel requests loaded:', allRequests);
        
        // Filter requests for current user
        const userRequests = dashboardService.filterUserRequests(allRequests, profile.userId);
        setRequests(userRequests);
        
        // Calculate stats
        const calculatedStats = dashboardService.calculateStats(userRequests);
        setStats(calculatedStats);
        
        console.log('✅ Dashboard initialized successfully');
        
      } catch (err) {
        console.error('❌ Error initializing dashboard:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  const getDisplayData = (limit = 5) => {
    return dashboardService.prepareDisplayData(requests, limit);
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const profile = await dashboardService.fetchUserProfile();
      setUserProfile(profile);

      if (profile) {
        const allRequests = await dashboardService.fetchTravelRequests();
        const userRequests = dashboardService.filterUserRequests(allRequests, profile.userId);
        setRequests(userRequests);
        setStats(dashboardService.calculateStats(userRequests));
      }
    } catch (err) {
      setError(err.message || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    userProfile,
    loading,
    error,
    stats,
    getDisplayData,
    refreshData
  };
};