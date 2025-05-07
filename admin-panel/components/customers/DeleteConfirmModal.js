"use client";

import { useState } from 'react';
import styles from './CustomerModal.module.css';

export default function DeleteConfirmModal({ itemName, itemType = 'customer', onClose, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Error deleting item:', error);
      setIsDeleting(false);
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.confirmModal}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete {itemType}</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            disabled={isDeleting}
          >
            &times;
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <p className={styles.confirmText}>
            Are you sure you want to delete <strong>{itemName}</strong>?
          </p>
          <p className={styles.warningText}>
            This action cannot be undone.
          </p>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
} 