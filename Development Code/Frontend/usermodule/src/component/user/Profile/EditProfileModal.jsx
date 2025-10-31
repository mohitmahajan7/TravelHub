// src/components/user/Profile/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import './EditProfileModal.css';

const EditProfileModal = ({ profile, onSave, onClose, loading, error }) => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    location: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        phoneNumber: profile.phoneNumber !== 'N/A' ? profile.phoneNumber : '',
        location: profile.location !== 'N/A' ? profile.location : ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h3>Edit Profile</h3>
          <button 
            className="modalClose" 
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modalBody">
            {error && (
              <div className="alert alertError">
                {error}
              </div>
            )}
            
            <div className="formGroup">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number (e.g., +1-555-0123)"
                disabled={loading}
                className={formErrors.phoneNumber ? 'error' : ''}
              />
              {formErrors.phoneNumber && (
                <span className="errorText">{formErrors.phoneNumber}</span>
              )}
            </div>

            <div className="formGroup">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location (e.g., New York, USA)"
                disabled={loading}
                className={formErrors.location ? 'error' : ''}
              />
              {formErrors.location && (
                <span className="errorText">{formErrors.location}</span>
              )}
            </div>

            {/* Display read-only fields for reference */}
            <div className="readOnlyFields">
              <h4>Account Information (Read Only)</h4>
              <div className="readOnlyItem">
                <label>Full Name</label>
                <span>{profile.displayName}</span>
              </div>
              <div className="readOnlyItem">
                <label>Email</label>
                <span>{profile.email}</span>
              </div>
              <div className="readOnlyItem">
                <label>Department</label>
                <span>{profile.department}</span>
              </div>
              <div className="readOnlyItem">
                <label>User ID</label>
                <span>{profile.userId}</span>
              </div>
            </div>
          </div>

          <div className="modalFooter">
            <button 
              type="button" 
              className="btn btnSecondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btnPrimary" 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;