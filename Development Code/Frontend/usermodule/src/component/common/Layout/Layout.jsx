import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import styles from './Sidebar.module.css';

const Layout = ({ 
  sidebarOpen, 
  onSidebarToggle, 
  activeContent, 
  onNavigate,
  user,
  children 
}) => {
  return (
    <div className={styles.container}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => onSidebarToggle(false)}
        activeContent={activeContent}
        onNavigate={onNavigate}
      />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => onSidebarToggle(false)}
        />
      )}
      
      <div className={styles.mainContent}>
        <Header 
          onMenuClick={() => onSidebarToggle(true)} 
          user={user}
        />
        
        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;