// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import profileService from '../services/profileService';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preparedData, setPreparedData] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🚀 Initializing profile data...');
      
      const userProfile = await profileService.fetchUserProfile();
      setProfile(userProfile);
      
      const preparedProfile = profileService.prepareProfileData(userProfile);
      setPreparedData(preparedProfile);
      
      console.log('✅ Profile data loaded successfully');
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await profileService.fetchUserProfile();
      setProfile(userProfile);
      const preparedProfile = profileService.prepareProfileData(userProfile);
      setPreparedData(preparedProfile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // FIXED UPDATE PROFILE FUNCTION
 const updateProfile = async (updateData) => {
  try {
    console.log('🔄 Starting profile update...');
    console.log('📝 Update data received in hook:', updateData);
    console.log('👤 Current profile structure:', profile);
    
    // Get the user ID - try multiple possible locations
    const userId = profile?.userId || profile?.employeeId || profile?.rawData?.userId;
    
    console.log('🔍 Extracted user ID:', userId);
    
    if (!userId) {
      console.error('❌ No user ID found in profile. Profile keys:', Object.keys(profile || {}));
      throw new Error('User ID not found in profile data');
    }

    console.log('📝 Calling profile service with user ID:', userId);
    const updatedProfile = await profileService.updateEmployeeProfile(
      userId, 
      updateData
    );
    
    console.log('✅ Update successful, refreshing profile...');
    await refreshProfile();
    
    console.log('✅ Profile updated and refreshed successfully');
    return updatedProfile;
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    throw err;
  }
};
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    preparedData,
    loading,
    error,
    refreshProfile,
    updateProfile, // Make sure this is exported
    getDisplayName: () => profileService.getDisplayName(profile),
    getEmail: () => profileService.getEmail(profile),
    getUserId: () => profileService.getUserId(profile),
    getDepartment: () => profileService.getDepartment(profile),
    generateAvatarUrl: () => profileService.generateAvatarUrl(
      profileService.getDisplayName(profile), 
      profileService.getEmail(profile)
    )
  };
};