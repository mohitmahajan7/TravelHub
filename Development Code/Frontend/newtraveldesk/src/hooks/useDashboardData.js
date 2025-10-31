// traveldesk/src/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchPendingApprovals, calculateStats } from '../services/dashboardService';

export const useDashboardData = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pendingValidation: 0,
    awaitingBooking: 0,
    policyExceptions: 0,
    bookedToday: 0
  });

  const loadPendingApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchPendingApprovals();
      setPendingRequests(data);
      setStats(calculateStats(data));
      
    } catch (error) {
      setError(error.message);
      setPendingRequests([]);
      setStats({
        pendingValidation: 0,
        awaitingBooking: 0,
        policyExceptions: 0,
        bookedToday: 0
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => {
    loadPendingApprovals();
  }, [loadPendingApprovals]);

  useEffect(() => {
    loadPendingApprovals();
  }, [loadPendingApprovals]);

  return {
    pendingRequests,
    stats,
    loading,
    error,
    refreshData
  };
};