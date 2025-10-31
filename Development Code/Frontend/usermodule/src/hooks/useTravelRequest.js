import { useState, useCallback } from 'react';
import { travelService } from '../services/travelService';

export const useTravelRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createTravelRequest = useCallback(async (requestData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('📦 Creating travel request with data:', requestData);
      
      const result = await travelService.createTravelRequest(requestData);
      
      setSuccess(true);
      console.log('✅ Travel request created successfully:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Failed to create travel request:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAsDraft = useCallback(async (draftData) => {
    return createTravelRequest(draftData);
  }, [createTravelRequest]);

  const submitRequest = useCallback(async (requestData) => {
    return createTravelRequest(requestData);
  }, [createTravelRequest]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(false);
  }, []);

  return {
    loading,
    error,
    success,
    createTravelRequest,
    saveAsDraft,
    submitRequest,
    clearError,
    clearSuccess,
  };
};