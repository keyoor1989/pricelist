'use client';

import styles from '../brands/ModalStyles.module.css';
import productStyles from './ProductModalStyles.module.css';

export default function DeleteConfirmModal({ 
  product, 
  brandName, 
  modelName, 
  onClose, 
  onConfirm, 
  isLoading = false 
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${productStyles.deleteModalContent}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete Product</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            disabled={isLoading}
          >
            &times;
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <p className={productStyles.deleteConfirmText}>
            Are you sure you want to delete the product <strong>{product.name}</strong>?
          </p>
          <div className={productStyles.productDetailBox}>
            <p><strong>Brand:</strong> {brandName}</p>
            <p><strong>Model:</strong> {modelName}</p>
            <p><strong>Part Code:</strong> {product.partCode || 'N/A'}</p>
          </div>
          <p className={productStyles.warningText}>
            This action cannot be undone.
          </p>
        </div>
        
        <div className={styles.modalFooter}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="button"
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
} 