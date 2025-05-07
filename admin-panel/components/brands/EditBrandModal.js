'use client';

import { useState, useEffect } from 'react';
import styles from './ModalStyles.module.css';

export default function EditBrandModal({ brand, onClose, onSave, isSubmitting }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    logo: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Initialize form with brand data
  useEffect(() => {
    if (brand) {
      setFormData({
        id: brand.id,
        name: brand.name,
        logo: brand.logoUrl || ''
      });
    }
  }, [brand]);
  
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
      newErrors.name = 'Brand name is required';
    }
    
    // Logo URL is optional, but if provided, should be a valid URL
    if (formData.logo && !isValidUrl(formData.logo)) {
      newErrors.logo = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Check if URL is valid
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // If form is valid, save the brand
      onSave({
        id: formData.id,
        name: formData.name,
        logo: formData.logo || 'https://via.placeholder.com/150x50?text=' + encodeURIComponent(formData.name)
      });
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Brand</h2>
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
                Brand Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.formControl}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter brand name"
                required
                disabled={isSubmitting}
              />
              {errors.name && (
                <div className={styles.invalidFeedback}>{errors.name}</div>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="logo" className={styles.formLabel}>
                Logo URL
              </label>
              <input
                type="text"
                id="logo"
                name="logo"
                className={styles.formControl}
                value={formData.logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                disabled={isSubmitting}
              />
              {errors.logo && (
                <div className={styles.invalidFeedback}>{errors.logo}</div>
              )}
              <small className="text-muted">
                Leave empty to use a placeholder logo
              </small>
            </div>
            
            {formData.logo && (
              <div className={styles.logoPreview}>
                <p>Current Logo:</p>
                <img 
                  src={formData.logo} 
                  alt={formData.name} 
                  style={{ maxWidth: '100%', maxHeight: '80px' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150x50?text=Invalid+Image+URL';
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