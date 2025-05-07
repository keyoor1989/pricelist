"use client";

import { useState } from 'react';
import styles from './CustomerModal.module.css';

export default function AddCustomerModal({ onClose, onSave }) {
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'END_USER'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!customer.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (customer.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (customer.phone && !/^\+?[0-9]{10,15}$/.test(customer.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(customer);
      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Customer</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={customer.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter customer name"
              required
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={customer.email || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter email address"
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={customer.phone || ''}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="address" className={styles.label}>Address</label>
            <textarea
              id="address"
              name="address"
              value={customer.address || ''}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Enter address"
              rows={3}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="type" className={styles.label}>Customer Type</label>
            <select
              id="type"
              name="type"
              value={customer.type}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="END_USER">End User</option>
              <option value="DEALER">Dealer</option>
            </select>
          </div>
          
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.button} ${styles.cancelButton}`}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.button} ${styles.saveButton}`}
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