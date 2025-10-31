import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ 
  variant = "pending", 
  size = "medium", 
  outline = false, 
  children,
  className = "" 
}) => {
  const badgeClass = [
    styles.badge,
    styles[variant] || styles.pending,
    styles[size] || styles.medium,
    outline ? styles.outline : ''
  ].filter(Boolean).join(' ');

  return <span className={`${badgeClass} ${className}`}>{children}</span>;
};

export default Badge;