import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authStatus, setAuthStatus] = useState('checking');
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    setAuthStatus('checking');
    setError(null);

    try {
      console.log('🔐 Fetching user profile...');
      
      // Try backend endpoint first (has cookie access)
      const userData = await authService.getCurrentUser();
      
      if (userData && userData.userId) {
        console.log('✅ User authenticated:', userData);
        setUser(userData);
        setAuthStatus('authenticated');
        return userData;
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      setError(error.message);
      setAuthStatus('failed');
      return null;
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setAuthStatus('checking');
    setError(null);

    try {
      const result = await authService.login(credentials);
      
      if (result.token) {
        authService.setToken(result.token, credentials.remember);
        const userData = await fetchUserProfile();
        return { success: true, user: userData };
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      setError(error.message);
      setAuthStatus('failed');
      return { success: false, error: error.message };
    }
  }, [fetchUserProfile]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearToken();
      setUser(null);
      setAuthStatus('failed');
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return {
    user,
    authStatus,
    error,
    isAuthenticated: authStatus === 'authenticated',
    isLoading: authStatus === 'checking',
    login,
    logout,
    refreshUser: fetchUserProfile,
  };
};