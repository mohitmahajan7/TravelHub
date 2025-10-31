import React from 'react';
import styles from './CardKPI.module.css';

const CardKPI = ({ icon, title, value, tone = "blue", onClick, loading = false }) => {
  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  return (
    <div 
      className={`${styles.statCard} ${onClick ? styles.clickable : ''} ${loading ? styles.loading : ''}`}
      onClick={handleClick}
    >
      <div className={`${styles.statIcon} ${styles[tone]}`}>
        {icon}
      </div>
      <div className={styles.statInfo}>
        <h3 className={styles.statValue}>
          {loading ? '...' : value}
        </h3>
        <p className={styles.statTitle}>{title}</p>
      </div>
      
      {onClick && (
        <div className={styles.arrowIndicator}>
          →
        </div>
      )}
    </div>
  );
};

export default CardKPI;