import React, { useState } from 'react';
import './Header.css';
import { FaSignOutAlt } from "react-icons/fa";

const Header = ({ onMenuToggle }) => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const avatar = "https://ui-avatars.com/api/?name=Travel+Desk&background=0D8ABC&color=fff";

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

  return (
    <div className="header">
      <div className="headerLeft">
        <button className="mobileMenuBtn" onClick={onMenuToggle}>
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
          <img src={avatar} alt="User" />
          <div className="userDetails">
            <div className="userName">Travel Desk</div>
            <small className="userId">ID: TDR001</small>
          </div>
        </div>

        {/* Logout Power Button - Added on the right side */}
        <button 
          className="logoutPowerBtn"
          onClick={handleLogout}
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

export { Header };
export default Header;