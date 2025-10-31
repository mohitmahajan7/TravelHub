import { useState, useEffect, useMemo } from 'react';
import { travelRequestService } from '../services/travelRequestService';
import { useAuth } from './useAuth';

export const useTravelRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch travel requests from backend and filter by employeeId
  useEffect(() => {
    const fetchTravelRequests = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        
        console.log('📋 Fetching travel requests for user:', user.userId);
        const userRequests = await travelRequestService.getUserTravelRequests(user.userId);
        
        setRequests(userRequests);
        console.log(`✅ Loaded ${userRequests.length} travel requests`);
      } catch (error) {
        console.error('❌ Error fetching travel requests:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelRequests();
  }, [user]);

  const refreshRequests = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const userRequests = await travelRequestService.getUserTravelRequests(user.userId);
      setRequests(userRequests);
    } catch (error) {
      console.error('❌ Error refreshing travel requests:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRequestById = async (requestId) => {
  try {
    console.log('🔍 Fetching request by ID:', requestId);
    // Replace with your actual API endpoint
    const response = await travelRequestService.getTravelRequestById(requestId);
    return response;
  } catch (error) {
    console.error('❌ Error fetching request:', error);
    throw error;
  }
};
 
 


  return {
    requests,
    loading,
    error,
    getRequestById,
    refreshRequests
  };
};