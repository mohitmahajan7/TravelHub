// useFinanceApprovals.js

import { useState, useEffect, useCallback } from 'react';
import { financeApprovalService } from '../services/financeApprovalService.js';

export const useFinanceApprovals = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  // Separate function to fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      console.log('👤 Fetching user data from API...');
      const userData = await financeApprovalService.fetchCurrentUser();
      setCurrentUser(userData);
      setUserLoaded(true);
      console.log('✅ User data loaded successfully:', userData);
      return userData;
    } catch (err) {
      console.error('❌ Failed to fetch user data:', err);
      setUserLoaded(false);
      throw err;
    }
  }, []);

  // Separate function to fetch approvals
  const fetchApprovalsData = useCallback(async () => {
    try {
      console.log('📋 Fetching pending approvals...');
      const approvalsData = await financeApprovalService.fetchPendingApprovals();
      setPendingRequests(approvalsData);
      console.log('✅ Approvals data loaded successfully');
      return approvalsData;
    } catch (err) {
      console.error('❌ Failed to fetch approvals:', err);
      throw err;
    }
  }, []);

  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Initializing finance approvals data...');
      
      // Fetch user data first - handle auth failures gracefully
      try {
        await fetchUserData();
      } catch (authError) {
        console.warn('⚠️ Auth failed but continuing:', authError.message);
        // Don't block the entire app if auth fails
      }
      
      // Then fetch approvals
      await fetchApprovalsData();
      
    } catch (err) {
      console.error('❌ Initialization error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchUserData, fetchApprovalsData]);

  const refreshApprovals = useCallback(async () => {
    try {
      setLoading(true);
      await fetchApprovalsData();
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchApprovalsData]);

  const refreshUserData = useCallback(async () => {
    try {
      console.log('🔄 Refreshing user data...');
      await fetchUserData();
    } catch (err) {
      console.error('❌ Failed to refresh user data:', err);
      throw err;
    }
  }, [fetchUserData]);

  const executeApprove = useCallback(async (request) => {
    console.log('🔄 Checking user state before approval:', {
      currentUser: !!currentUser,
      userLoaded,
      userId: currentUser?.userId
    });

    let userToUse = currentUser;

    // If user is not loaded, try to get user data
    if (!currentUser || !userLoaded) {
      console.log('⚠️ User not loaded, attempting to refresh...');
      try {
        userToUse = await refreshUserData();
      } catch (err) {
        console.warn('❌ User refresh failed, using fallback');
        // Use current user even if it's minimal
        if (!userToUse) {
          throw new Error('User authentication failed. Please refresh the page and try again.');
        }
      }
    }

    try {
      setActionLoading(true);
      console.log('🚀 Starting approval with user:', userToUse);
      
      const result = await financeApprovalService.approveRequest(request, userToUse);
      
      // Remove approved request from list
      setPendingRequests(prev => prev.filter(req => req.workflowId !== request.workflowId));
      
      console.log('✅ Approval completed successfully');
      return result;
    } catch (err) {
      console.error('❌ Approval failed:', err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [currentUser, userLoaded, refreshUserData]);

  const executeReject = useCallback(async (request, rejectionReason) => {
    console.log('🔄 Checking user state before rejection:', {
      currentUser: !!currentUser,
      userLoaded,
      userId: currentUser?.userId
    });

    let userToUse = currentUser;

    // If user is not loaded, try to get user data
    if (!currentUser || !userLoaded) {
      console.log('⚠️ User not loaded, attempting to refresh...');
      try {
        userToUse = await refreshUserData();
      } catch (err) {
        console.warn('❌ User refresh failed, using fallback');
        // Use current user even if it's minimal
        if (!userToUse) {
          throw new Error('User authentication failed. Please refresh the page and try again.');
        }
      }
    }

    try {
      setActionLoading(true);
      console.log('🚀 Starting rejection with user:', userToUse);
      
      const result = await financeApprovalService.rejectRequest(request, userToUse, rejectionReason);
      
      // Remove rejected request from list
      setPendingRequests(prev => prev.filter(req => req.workflowId !== request.workflowId));
      
      console.log('✅ Rejection completed successfully');
      return result;
    } catch (err) {
      console.error('❌ Rejection failed:', err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [currentUser, userLoaded, refreshUserData]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return {
    pendingRequests,
    loading,
    error,
    actionLoading,
    currentUser,
    userLoaded,
    refreshApprovals,
    refreshUserData,
    executeApprove,
    executeReject,
  };
};