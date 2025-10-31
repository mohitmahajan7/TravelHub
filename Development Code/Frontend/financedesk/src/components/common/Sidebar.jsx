import React, { useEffect, useRef } from 'react';
import './Sidebar.css';
import Bwclogo from "./BWCLOGO.png"

const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const sidebarRef = useRef(null);
  const backdropRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-chart-bar', label: 'Dashboard' },
    { id: 'pending-approvals', icon: 'fas fa-clock', label: 'Pending Approvals' },
    { id: 'reimbursements', icon: 'fas fa-money-bill-wave', label: 'Reimbursements' },
    { id: 'budget-tracking', icon: 'fas fa-chart-line', label: 'Budget Tracking' },
    { id: 'policy-exceptions', icon: 'fas fa-exclamation-circle', label: 'Policy Exceptions' },
    { id: 'history', icon: 'fas fa-history', label: 'History' },
    { id: 'reports', icon: 'fas fa-file-alt', label: 'Reports' }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('Logged out successfully!');
    }
  };

  const handleMenuItemClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  const handleBackdropClick = () => {
    setIsMobileOpen(false);
  };

  const handleToggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen, setIsMobileOpen]);

  // Determine sidebar classes based on screen size and state
  const getSidebarClasses = () => {
    const classes = ['sidebar'];
    
    if (window.innerWidth <= 768) {
      classes.push(isMobileOpen ? 'mobile-open' : 'mobile-closed');
    } else if (window.innerWidth <= 992) {
      classes.push('collapsed');
    }
    
    return classes.join(' ');
  };

  const getBackdropClasses = () => {
    return `sidebar-backdrop ${isMobileOpen && window.innerWidth <= 768 ? 'mobile-open' : ''}`;
  };

  return (
    <>
      <div 
        ref={backdropRef}
        className={getBackdropClasses()}
        onClick={handleBackdropClick}
      />
      
      <div 
        ref={sidebarRef}
        className={getSidebarClasses()}
        id="sidebar"
      >
       <div className="sidebarHeader">
        <div className="brandContainer">
          <div className="logoWrapper">
            <img src={Bwclogo} alt="BWC Labs" />
          </div>
          <div className="brandText">
            <span className="companyName">BWC Labs</span>
            <span className="appName">Brainwave Travel Hub</span>
          </div>
        </div>
      </div>
        
        <ul className="nav-menu">
          {menuItems.map((item, index) => (
            <li 
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleMenuItemClick(item.id)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </li>
          ))}
          
          <li 
            className="nav-item"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;