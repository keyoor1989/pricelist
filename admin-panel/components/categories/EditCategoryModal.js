'use client';

import { useState, useEffect } from 'react';
import styles from '../brands/ModalStyles.module.css';

export default function EditCategoryModal({ category, onClose, onSave, isSubmitting }) {
  const [formData, setFormData] = useState({
    id: '',
    name: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Initialize form with category data
  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.name
      });
    }
  }, [category]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If form is valid, save the category
      onSave({
        id: formData.id,
        name: formData.name
      });
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Category</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Category Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.formControl}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                required
                disabled={isSubmitting}
              />
              {errors.name && (
                <div className={styles.invalidFeedback}>{errors.name}</div>
              )}
            </div>
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
              type="submit"
              className={styles.btnPrimary}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 