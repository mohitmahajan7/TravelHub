// src/components/user/Profile/Profile.jsx
import React, { useState } from 'react';
import Badge from '../../common/Badge/Badge.jsx';
import { useProfile } from '../../../hooks/useProfile';
import EditProfileModal from './EditProfileModal';
import "./Profile.css";

const Profile = () => {
  const {
    profile,
    preparedData,
    loading,
    error,
    refreshProfile,
    updateProfile
  } = useProfile();

  const [showEditModal, setShowEditModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Handle edit profile
  const handleEditProfile = async (formData) => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      console.log('🔄 Starting profile update from component...');
      
      await updateProfile(formData);
      setShowEditModal(false);
      
      console.log('✅ Profile update completed successfully');
    } catch (err) {
      console.error('❌ Profile update failed:', err);
      setUpdateError(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Loading State Component
  if (loading) {
    return <ProfileLoading />;
  }

  // Error State Component
  if (error) {
    return <ProfileError error={error} onRetry={refreshProfile} />;
  }

  // No Profile Data State Component
  if (!profile || !preparedData) {
    return <ProfileEmpty onRetry={refreshProfile} />;
  }

  return (
    <div className="content contentprofile">
      <ProfileHeader />
      
      {/* Update Success/Error Messages */}
      {updateError && (
        <div className="alert alertError" style={{ marginBottom: '20px' }}>
          <strong>Error updating profile:</strong> {updateError}
        </div>
      )}
      
      <div className="profileContainer">
        {/* Profile Card with Avatar */}
        <ProfileCard 
          preparedData={preparedData} 
          onEditClick={() => setShowEditModal(true)}
        />

        {/* Profile Details Card */}
        <ProfileDetails preparedData={preparedData} />
      </div>

      {/* Additional Sections */}
      {preparedData.projects.length > 0 && (
        <ProjectsSection projects={preparedData.projects} />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={preparedData}
          onSave={handleEditProfile}
          onClose={() => {
            setShowEditModal(false);
            setUpdateError(null);
          }}
          loading={updateLoading}
          error={updateError}
        />
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <DebugInfo profile={profile} />
      )}
    </div>
  );
};

// Sub-components (keep your existing ones)
const ProfileLoading = () => (
  <div className="content contentprofile">
    <div className="detailHeader">
      <h2>User Profile</h2>
      <p>Loading your profile information...</p>
    </div>
    <div className="profileContainer">
      <div className="card profileCard" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="loading-spinner"></div>
        <p>Loading profile data...</p>
      </div>
    </div>
  </div>
);

const ProfileError = ({ error, onRetry }) => (
  <div className="content contentprofile">
    <div className="detailHeader">
      <h2>User Profile</h2>
      <p>Unable to load profile information</p>
    </div>
    <div className="profileContainer">
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ color: '#dc3545', fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          Please check if you are logged in and try again.
        </p>
        <button 
          className="btn btnPrimary" 
          onClick={onRetry}
          style={{ marginTop: '20px' }}
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

const ProfileEmpty = ({ onRetry }) => (
  <div className="content contentprofile">
    <div className="detailHeader">
      <h2>User Profile</h2>
      <p>No profile data available</p>
    </div>
    <div className="profileContainer">
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ color: '#6c757d', fontSize: '48px', marginBottom: '20px' }}>👤</div>
        <h3>No Profile Data</h3>
        <p>Unable to load user profile information.</p>
        <button 
          className="btn btnPrimary" 
          onClick={onRetry}
          style={{ marginTop: '20px' }}
        >
          Reload
        </button>
      </div>
    </div>
  </div>
);

const ProfileHeader = () => (
  <div className="detailHeader">
    <h2>User Profile</h2>
    <p>Manage your personal information and account settings</p>
  </div>
);

const ProfileCard = ({ preparedData, onEditClick }) => (
  <div className="card profileCard">
    <div className="cardBody" style={{ textAlign: 'center' }}>
      <img
        src={preparedData.avatarUrl}
        alt="Profile"
        className="profileImage"
      />
      <h3>{preparedData.displayName}</h3>
      <p style={{ color: '#6c757d', marginBottom: '15px' }}>{preparedData.department}</p>
      <div style={{ margin: '20px 0' }}>
        <Badge variant={preparedData.status}>
          {preparedData.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      <div className="profileActionButtons">
        <button 
          className="btn btnPrimaryProfile profileActionBtn"
          onClick={onEditClick}
        >
          <i className="fas fa-user-edit"></i> Edit Profile
        </button>
        <button className="btn btnSecondary profileActionBtn">
          <i className="fas fa-camera"></i> Change Photo
        </button>
      </div>
    </div>
  </div>
);

const ProfileDetails = ({ preparedData }) => (
  <div className="card profileDetails">
    <div className="cardHeader">
      <h3>Personal Information</h3>
    </div>
    <div className="cardBody">
      <DetailItem label="Full Name" value={preparedData.displayName} />
      <DetailItem label="User ID" value={preparedData.userId} />
      <DetailItem label="Email Address" value={preparedData.email} />
      <DetailItem label="Phone Number" value={preparedData.phoneNumber} />
      <DetailItem label="Department" value={preparedData.department} />
      <DetailItem label="Position" value={preparedData.position} />
      {/* <DetailItem label="Location" value={preparedData.location} /> */}
      <DetailItem label="Date Joined" value={preparedData.joinDate} />
      
      {preparedData.manager && (
        <DetailItem label="Manager" value={preparedData.manager.name} />
      )}
      
      {preparedData.roles.length > 0 && (
        <div className="detailItem">
          <label>Roles</label>
          <div>
            {preparedData.roles.map((role, index) => (
              <Badge key={index} variant="info" style={{ marginRight: '5px', marginBottom: '5px' }}>
                {role}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {preparedData.permissions.length > 0 && (
        <DetailItem 
          label="Permissions" 
          value={preparedData.permissions.join(', ')} 
        />
      )}
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div className="detailItem">
    <label>{label}</label>
    <p>{value}</p>
  </div>
);

const ProjectsSection = ({ projects }) => (
  <div className="card" style={{ marginTop: '20px' }}>
    <div className="cardHeader">
      <h3>Assigned Projects</h3>
    </div>
    <div className="cardBody">
      <div className="projectsGrid">
        {projects.map((project, index) => (
          <div key={project.projectId || index} className="projectItem">
            <h4>{project.projectName || project.name || 'Unnamed Project'}</h4>
            <p>{project.description || 'No description available'}</p>
            {project.status && (
              <Badge variant={project.status === 'ACTIVE' ? 'active' : 'inactive'}>
                {project.status}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DebugInfo = ({ profile }) => (
  <div className="card" style={{ marginTop: '20px', background: '#f8f9fa' }}>
    <div className="cardHeader">
      <h3>Debug Information</h3>
    </div>
    <div className="cardBody">
      <details>
        <summary>Raw Profile Data</summary>
        <pre style={{ fontSize: '12px', overflow: 'auto', background: '#fff', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(profile, null, 2)}
        </pre>
      </details>
    </div>
  </div>
);

export default Profile;