'use client';

import styles from '../brands/ModalStyles.module.css';

export default function DeleteConfirmModal({ category, onClose, onConfirm, isSubmitting }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete Category</h2>
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
            Are you sure you want to delete the category <strong>{category.name}</strong>?
          </p>
          <p>
            This action cannot be undone. Products linked to this category may be affected.
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
            {isSubmitting ? 'Deleting...' : 'Delete Category'}
          </button>
        </div>
      </div>
    </div>
  );
} 