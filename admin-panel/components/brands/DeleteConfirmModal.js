'use client';

import styles from './ModalStyles.module.css';

export default function DeleteConfirmModal({ brand, onClose, onConfirm, isSubmitting }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete Brand</h2>
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
            Are you sure you want to delete the brand <strong>{brand.name}</strong>?
          </p>
          <p>
            This action cannot be undone.
          </p>
          
          {brand.logoUrl && (
            <div className={styles.logoPreview} style={{ marginTop: '1rem', textAlign: 'center' }}>
              <img 
                src={brand.logoUrl} 
                alt={brand.name} 
                style={{ maxWidth: '150px', maxHeight: '50px' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150x50?text=No+Image';
                }}
              />
            </div>
          )}
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
            {isSubmitting ? 'Deleting...' : 'Delete Brand'}
          </button>
        </div>
      </div>
    </div>
  );
} 