import React from 'react';
import { FaDownload } from "react-icons/fa";
import styles from './DocumentCard.module.css';

const DocumentCard = ({ 
  icon, 
  title, 
  description, 
  date, 
  size,
  onDownload 
}) => {
  return (
    <div className={styles.documentCard}>
      <div className={styles.documentIcon}>
        {icon}
      </div>
      <div className={styles.documentInfo}>
        <h4 className={styles.documentTitle}>{title}</h4>
        <p className={styles.documentDescription}>{description}</p>
        <div className={styles.documentMeta}>
          <span className={styles.documentDate}>{date}</span>
          <span className={styles.documentSize}>{size}</span>
        </div>
      </div>
      <button className={styles.downloadBtn} onClick={onDownload}>
        <FaDownload className={styles.btnIcon} /> Download
      </button>
    </div>
  );
};

export default DocumentCard;