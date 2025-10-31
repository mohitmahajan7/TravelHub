import React, { useState } from 'react';
import { FaBars, FaBell } from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Header = ({ onMenuClick, user }) => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const avatar = "https://ui-avatars.com/api/?name=HR+Manager&background=0D8ABC&color=fff";

  // Logout function
  const handleLogout = async () => {
    if (logoutLoading) return;
    
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    setLogoutLoading(true);

    try {
      console.log('🚪 Initiating logout...');

      // Call logout API through proxy
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      console.log('📋 Logout response status:', response.status);

      if (response.ok) {
        console.log('✅ Logout successful');
        
        // Clear all local storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Clear cookies
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        // Redirect to login page
        window.location.href = '/login';
      } else {
        throw new Error(`Logout failed with status: ${response.status}`);
      }

    } catch (error) {
      console.error('❌ Logout error:', error);
      
      // Even if API fails, clear local data and redirect
      localStorage.clear();
      sessionStorage.clear();
      
      alert('Logout completed. Redirecting to login...');
      window.location.href = '/login';
    } finally {
      setLogoutLoading(false);
    }
  };

  // Enhanced logout with multiple endpoints
  const handleEnhancedLogout = async () => {
    if (logoutLoading) return;
    
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    setLogoutLoading(true);

    try {
      console.log('🚪 Starting enhanced logout process...');

      // Try multiple logout endpoints
      const logoutEndpoints = [
        '/api/auth/logout',
        '/auth/logout'
      ];

      let logoutSuccess = false;

      // Try each endpoint
      for (const endpoint of logoutEndpoints) {
        try {
          console.log(`🔁 Trying logout endpoint: ${endpoint}`);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });

          if (response.ok) {
            console.log(`✅ Logout successful from ${endpoint}`);
            logoutSuccess = true;
            break;
          } else {
            console.log(`❌ Logout failed from ${endpoint}: ${response.status}`);
          }
        } catch (err) {
          console.log(`❌ Logout error from ${endpoint}:`, err.message);
        }
      }

      // Always clear client-side data
      console.log('🧹 Clearing client-side data...');
      
      // Clear localStorage
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('user_data');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.removeItem('jwtToken');
      sessionStorage.removeItem('user_data');
      sessionStorage.removeItem('auth_token');
      sessionStorage.clear();

      // Clear cookies
      document.cookie.split(";").forEach(function(c) {
        const cookie = c.trim();
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
      });

      console.log('✅ Client-side data cleared successfully');

      // Show appropriate message
      if (logoutSuccess) {
        alert('✅ Logout successful! Redirecting to login...');
      } else {
        alert('⚠️ Session cleared locally. Redirecting to login...');
      }

      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);

    } catch (error) {
      console.error('❌ Enhanced logout error:', error);
      
      // Fallback: clear everything and redirect
      localStorage.clear();
      sessionStorage.clear();
      
      alert('Session cleared. Redirecting to login...');
      window.location.href = '/login';
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <button className={styles.mobileMenuBtn} onClick={onMenuClick}>
          <FaBars />
        </button>
        <h1 className={styles.headerTitle}><span className="accentWord">BrainWave</span> Travel Hub</h1>
      </div>
     
      <div className={styles.headerRight}>
        <button className={styles.notificationBtn}>
          <FaBell className={styles.notificationIcon} />
        </button>
       
        <div className={styles.userProfile}>
          <img src={avatar} alt="User" />
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user?.name || 'User'}</div>
            <small className={styles.userId}>Employee ID: {user?.employeeId || 'N/A'}</small>
          </div>
        </div>

        {/* Logout Power Button - Added on the right side */}
        <button 
          className={styles.logoutPowerBtn}
          onClick={handleEnhancedLogout}
          disabled={logoutLoading}
          title="Logout"
        >
          {logoutLoading ? (
            <i className="fas fa-spinner fa-spin" style={{color: "gray", fontSize: "20px"}}></i>
          ) : (
            <i className="fa-solid fa-power-off" style={{color: "red", fontSize: "20px"}}></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;