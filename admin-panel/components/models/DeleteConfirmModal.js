'use client';

import styles from '../brands/ModalStyles.module.css';

export default function DeleteConfirmModal({ model, brandName, onClose, onConfirm, isSubmitting }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete Model</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <p>
            Are you sure you want to delete the model <strong>{model.name}</strong>?
          </p>
          <p>
            This model is linked to the brand <strong>{brandName}</strong>.
          </p>
          <p>
            This action cannot be undone.
          </p>
        </div>
        
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnDanger}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Deleting...' : 'Delete Model'}
          </button>
        </div>
      </div>
    </div>
  );
} 