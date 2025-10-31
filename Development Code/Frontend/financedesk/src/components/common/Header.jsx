import React, { useState } from 'react';
import './Header.css';

const Header = ({ title }) => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const avatar = "https://ui-avatars.com/api/?name=Finance&background=0D8ABC&color=fff";

  // Logout function
  const handleLogout = async () => {
    if (logoutLoading) return;
    
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    setLogoutLoading(true);

    try {
      console.log('🚪 Initiating logout from Finance...');

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

        console.log('🧹 All cookies and storage cleared');
        
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
      
      // Clear all cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      alert('Logout completed. Redirecting to login...');
      window.location.href = '/login';
    } finally {
      setLogoutLoading(false);
    }
  };

  // Enhanced logout with multiple endpoints
  const handleEnhancedLogout = async () => {
    if (logoutLoading) return;
    
    const confirmLogout = window.confirm('Are you sure you want to logout from Finance?');
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
      
      // Clear all localStorage items
      const localStorageKeys = [
        'jwtToken', 'user_data', 'auth_token', 'user', 
        'token', 'finance_token', 'session'
      ];
      
      localStorageKeys.forEach(key => localStorage.removeItem(key));
      localStorage.clear();

      // Clear all sessionStorage items
      const sessionStorageKeys = [
        'jwtToken', 'user_data', 'auth_token', 'user',
        'token', 'finance_session'
      ];
      
      sessionStorageKeys.forEach(key => sessionStorage.removeItem(key));
      sessionStorage.clear();

      // Clear all cookies thoroughly
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        // Clear cookie for current path
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        
        // Clear cookie for root path
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
        
        // Clear cookie for current domain
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=" + window.location.hostname + ";path=/";
      }

      console.log('✅ All client-side data cleared successfully');

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
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      alert('Session cleared. Redirecting to login...');
      window.location.href = '/login';
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="header">
      <div className="headerLeft">
        <button className="mobileMenuBtn">
          <i className="fas fa-bars"></i>
        </button>
        <h1 className="modernTitle">
          <span className="accentWord">BrainWave</span> Travel Hub
        </h1>
      </div>
      
      <div className="userInfo">
        <button className="notificationBtn">
          <i className="fas fa-bell"></i>
          <span className="notificationBadge"></span>
        </button>
        
        <div className="userProfile">
          <img src={avatar} alt="Finance User" />
          <div className="userDetails">
            <div className="userName">Finance</div>
            <small className="userId">ID: FM001</small>
          </div>
        </div>

        {/* Logout Power Button - Added on the right side */}
        <button 
          className="logoutPowerBtn"
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