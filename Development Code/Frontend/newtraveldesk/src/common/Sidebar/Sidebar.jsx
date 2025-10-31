import React from 'react';
import './Sidebar.css';
import Bwclogo from "./BWCLOGO.png"

const Sidebar = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-home', label: 'Dashboard' },
    { id: 'validationQueue', icon: 'fas fa-tasks', label: 'Validation Queue' },
    { id: 'bookingQueue', icon: 'fas fa-calendar-check', label: 'Booking Queue' },
    { id: 'exceptions', icon: 'fas fa-exclamation-triangle', label: 'Exceptions' },
    { id: 'bookingHistory', icon: 'fas fa-history', label: 'Booking History' },
    { id: 'reports', icon: 'fas fa-chart-bar', label: 'Reports' },
    { id: 'helpandsupport', icon: 'fas fa-question-circle', label: 'Help & Support' }, // Changed icon to be more appropriate
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logged out');
      // Add your actual logout logic here
    }
  };

  return (
    <div className="sidebar">
     <div className="sidebarHeader">
        <div className="brandContainer">
          <div className="logoWrapper">
            <img src={Bwclogo} alt="BWC Labs" />
          </div>
          <div className="brandText">
            <span className="companyName">BWC Labs</span>
            <span className="appName">BrainWave Travel Hub</span>
          </div>
        </div>
      </div>
      <ul className="nav-menu">
        {menuItems.map(item => (
          <li
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </li>
        ))}
        <li className="nav-item logout-item" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;