"use client";

import { useState } from 'react';
import styles from './CustomerModal.module.css';

export default function DeleteConfirmModal({ itemName, itemType, onClose, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      // The parent component will handle closing the modal after successful deletion
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
      setIsDeleting(false);
    }
  };
  
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Confirm Deletion</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className={styles.form}>
          <p>
            Are you sure you want to delete the {itemType} <strong>{itemName}</strong>?
            This action cannot be undone.
          </p>
          
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.button} ${styles.cancelButton}`}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className={`${styles.button} ${styles.deleteButton}`}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : `Delete ${itemType}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 