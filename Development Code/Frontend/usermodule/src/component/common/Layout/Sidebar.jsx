import React from 'react';
import {
  FaTimes, FaSuitcase, FaPlusCircle, FaList,
  FaTasks, FaUser, FaInfoCircle, FaSignOutAlt
} from 'react-icons/fa';
import styles from './Sidebar.module.css';
import Bwclogo from './BWCLOGO.png';

const Sidebar = ({ isOpen, onClose, activeContent, onNavigate }) => {
  const menuItems = [
    { path: '/dashboard', icon: FaSuitcase, label: 'Dashboard' },
    { path: '/new-request', icon: FaPlusCircle, label: 'New Request' },
    { path: '/my-requests', icon: FaList, label: 'My Requests' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
    { path: '/help', icon: FaInfoCircle, label: 'Help & Support' },
    { path: '/logout', icon: FaSignOutAlt, label: 'Logout' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard' && activeContent === '/') return true;
    return activeContent === path || activeContent.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    if (path === '/logout') {
      console.log('Logout clicked');
      return;
    }
    onNavigate(path);
  };

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.brandContainer}>
          <div className={styles.logoWrapper}>
            <img src={Bwclogo} alt="BWC Labs" />
          </div>
          <div className={styles.brandText}>
            <span className={styles.companyName}>BWC Labs</span>
            <span className={styles.appName}>BrainWave Travel Hub</span>
          </div>
        </div>
      </div>
      <div className={styles.sidebarMenu}>
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`${styles.menuItem} ${isActive(item.path) ? styles.active : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            <item.icon className={styles.menuIcon} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;