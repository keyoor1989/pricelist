"use client";

import { useState } from 'react';
import styles from './CustomerModal.module.css';

export default function AddCustomerModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'END_USER',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    const newErrors = {};
    
    // Name is required
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Email validation (optional field)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (optional field)
    if (formData.phone && !/^[0-9+\- ]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Customer</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Name <span className={styles.requiredMark}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.formControl} ${errors.name ? styles.formControlError : ''}`}
                disabled={isSubmitting}
              />
              {errors.name && <div className={styles.formError}>{errors.name}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.formControl} ${errors.email ? styles.formControlError : ''}`}
                disabled={isSubmitting}
              />
              {errors.email && <div className={styles.formError}>{errors.email}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`${styles.formControl} ${errors.phone ? styles.formControlError : ''}`}
                disabled={isSubmitting}
              />
              {errors.phone && <div className={styles.formError}>{errors.phone}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="address" className={styles.formLabel}>
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={styles.formControl}
                rows={3}
                disabled={isSubmitting}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="type" className={styles.formLabel}>
                Customer Type <span className={styles.requiredMark}>*</span>
              </label>
              <div className={styles.typeSelector}>
                <label className={`${styles.typeOption} ${formData.type === 'DEALER' ? styles.selected : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    value="DEALER"
                    checked={formData.type === 'DEALER'}
                    onChange={handleChange}
                    className={styles.typeInput}
                    disabled={isSubmitting}
                  />
                  <span className={styles.typeLabel}>Dealer</span>
                </label>
                <label className={`${styles.typeOption} ${formData.type === 'END_USER' ? styles.selected : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    value="END_USER"
                    checked={formData.type === 'END_USER'}
                    onChange={handleChange}
                    className={styles.typeInput}
                    disabled={isSubmitting}
                  />
                  <span className={styles.typeLabel}>End User</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 