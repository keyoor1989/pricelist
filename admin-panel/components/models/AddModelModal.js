'use client';

import { useState } from 'react';
import styles from '../brands/ModalStyles.module.css';

export default function AddModelModal({ brands, onClose, onSave, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    brandId: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'brandId' ? value : value
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
      newErrors.name = 'Model name is required';
    }
    
    if (!formData.brandId) {
      newErrors.brandId = 'Please select a brand';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If form is valid, save the model
      onSave({
        name: formData.name,
        brandId: formData.brandId
      });
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Model</h2>
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
                Model Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.formControl}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter model name"
                required
                disabled={isSubmitting}
              />
              {errors.name && (
                <div className={styles.invalidFeedback}>{errors.name}</div>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="brandId" className={styles.formLabel}>
                Brand *
              </label>
              <select
                id="brandId"
                name="brandId"
                className={styles.formControl}
                value={formData.brandId}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brandId && (
                <div className={styles.invalidFeedback}>{errors.brandId}</div>
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
              {isSubmitting ? 'Saving...' : 'Save Model'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 