'use client';

import { useState, useEffect } from 'react';
import styles from '../brands/ModalStyles.module.css';
import productStyles from './ProductModalStyles.module.css';

export default function EditProductModal({ product, brands, models, categories, onClose, onSave, isLoading = false }) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    partCode: '',
    brandId: '',
    modelId: '',
    categoryId: '',
    purchasePrice: '',
    dealerPrice: '',
    endUserPrice: '',
    gst: '',
    photoUrl: ''
  });
  
  const [errors, setErrors] = useState({});
  const [filteredModels, setFilteredModels] = useState([]);
  
  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        partCode: product.partCode || '',
        brandId: product.brandId,
        modelId: product.modelId,
        categoryId: product.categoryId,
        purchasePrice: product.purchasePrice,
        dealerPrice: product.dealerPrice,
        endUserPrice: product.endUserPrice,
        gst: product.gst,
        photoUrl: product.photoUrl || ''
      });
    }
  }, [product]);
  
  // Update filtered models when brand changes
  useEffect(() => {
    if (formData.brandId) {
      const brandId = parseInt(formData.brandId, 10);
      setFilteredModels(models.filter(model => model.brandId === brandId));
      
      // Reset model selection if it doesn't belong to selected brand
      if (formData.modelId) {
        const modelExists = models.some(
          model => model.id === parseInt(formData.modelId, 10) && model.brandId === brandId
        );
        
        if (!modelExists) {
          setFormData(prev => ({ ...prev, modelId: '' }));
        }
      }
    } else {
      setFilteredModels([]);
      setFormData(prev => ({ ...prev, modelId: '' }));
    }
  }, [formData.brandId, models]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (['brandId', 'modelId', 'categoryId'].includes(name)) {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value, 10) : ''
      });
    } else if (['purchasePrice', 'dealerPrice', 'endUserPrice', 'gst'].includes(name)) {
      const numericValue = value === '' ? '' : parseFloat(value);
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
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
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.brandId) {
      newErrors.brandId = 'Please select a brand';
    }
    
    if (!formData.modelId) {
      newErrors.modelId = 'Please select a model';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    
    if (!formData.purchasePrice && formData.purchasePrice !== 0) {
      newErrors.purchasePrice = 'Purchase price is required';
    } else if (formData.purchasePrice < 0) {
      newErrors.purchasePrice = 'Price cannot be negative';
    }
    
    if (!formData.dealerPrice && formData.dealerPrice !== 0) {
      newErrors.dealerPrice = 'Dealer price is required';
    } else if (formData.dealerPrice < 0) {
      newErrors.dealerPrice = 'Price cannot be negative';
    }
    
    if (!formData.endUserPrice && formData.endUserPrice !== 0) {
      newErrors.endUserPrice = 'End user price is required';
    } else if (formData.endUserPrice < 0) {
      newErrors.endUserPrice = 'Price cannot be negative';
    }
    
    if (!formData.gst && formData.gst !== 0) {
      newErrors.gst = 'GST percentage is required';
    } else if (formData.gst < 0 || formData.gst > 100) {
      newErrors.gst = 'GST must be between 0 and 100';
    }
    
    // Photo URL is optional, but if provided, should be a valid URL
    if (formData.photoUrl && !isValidUrl(formData.photoUrl)) {
      newErrors.photoUrl = 'Please enter a valid URL';
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
      // If form is valid, save the product
      const defaultPhotoUrl = formData.photoUrl || `https://via.placeholder.com/100x100?text=${encodeURIComponent(formData.name)}`;
      
      onSave({
        ...formData,
        photoUrl: defaultPhotoUrl
      });
    }
  };
  
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${productStyles.productModalContent}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit Product</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            disabled={isLoading}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={`${styles.modalBody} ${productStyles.productModalBody}`}>
            <div className={productStyles.formGrid}>
              {/* Product Name */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.formControl}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
                {errors.name && (
                  <div className={styles.invalidFeedback}>{errors.name}</div>
                )}
              </div>
              
              {/* Part Code */}
              <div className={styles.formGroup}>
                <label htmlFor="partCode" className={styles.formLabel}>
                  Part Code
                </label>
                <input
                  type="text"
                  id="partCode"
                  name="partCode"
                  className={styles.formControl}
                  value={formData.partCode}
                  onChange={handleChange}
                  placeholder="Enter part code"
                />
              </div>
              
              {/* Brand */}
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
              
              {/* Model */}
              <div className={styles.formGroup}>
                <label htmlFor="modelId" className={styles.formLabel}>
                  Model *
                </label>
                <select
                  id="modelId"
                  name="modelId"
                  className={styles.formControl}
                  value={formData.modelId}
                  onChange={handleChange}
                  disabled={!formData.brandId}
                  required
                >
                  <option value="">Select a model</option>
                  {filteredModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                {errors.modelId && (
                  <div className={styles.invalidFeedback}>{errors.modelId}</div>
                )}
              </div>
              
              {/* Category */}
              <div className={styles.formGroup}>
                <label htmlFor="categoryId" className={styles.formLabel}>
                  Category *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className={styles.formControl}
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <div className={styles.invalidFeedback}>{errors.categoryId}</div>
                )}
              </div>
              
              {/* Purchase Price */}
              <div className={styles.formGroup}>
                <label htmlFor="purchasePrice" className={styles.formLabel}>
                  Purchase Price (₹) *
                </label>
                <input
                  type="number"
                  id="purchasePrice"
                  name="purchasePrice"
                  className={styles.formControl}
                  value={formData.purchasePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
                {errors.purchasePrice && (
                  <div className={styles.invalidFeedback}>{errors.purchasePrice}</div>
                )}
              </div>
              
              {/* Dealer Price */}
              <div className={styles.formGroup}>
                <label htmlFor="dealerPrice" className={styles.formLabel}>
                  Dealer Price (₹) *
                </label>
                <input
                  type="number"
                  id="dealerPrice"
                  name="dealerPrice"
                  className={styles.formControl}
                  value={formData.dealerPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
                {errors.dealerPrice && (
                  <div className={styles.invalidFeedback}>{errors.dealerPrice}</div>
                )}
              </div>
              
              {/* End User Price */}
              <div className={styles.formGroup}>
                <label htmlFor="endUserPrice" className={styles.formLabel}>
                  End User Price (₹) *
                </label>
                <input
                  type="number"
                  id="endUserPrice"
                  name="endUserPrice"
                  className={styles.formControl}
                  value={formData.endUserPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
                {errors.endUserPrice && (
                  <div className={styles.invalidFeedback}>{errors.endUserPrice}</div>
                )}
              </div>
              
              {/* GST */}
              <div className={styles.formGroup}>
                <label htmlFor="gst" className={styles.formLabel}>
                  GST (%)
                </label>
                <input
                  type="number"
                  id="gst"
                  name="gst"
                  className={styles.formControl}
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="18"
                  min="0"
                  max="100"
                  step="0.01"
                />
                {errors.gst && (
                  <div className={styles.invalidFeedback}>{errors.gst}</div>
                )}
              </div>
              
              {/* Photo URL */}
              <div className={`${styles.formGroup} ${productStyles.fullWidth}`}>
                <label htmlFor="photoUrl" className={styles.formLabel}>
                  Photo URL
                </label>
                <input
                  type="text"
                  id="photoUrl"
                  name="photoUrl"
                  className={styles.formControl}
                  value={formData.photoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/photo.jpg"
                />
                {errors.photoUrl && (
                  <div className={styles.invalidFeedback}>{errors.photoUrl}</div>
                )}
                <small className={productStyles.helperText}>
                  Leave empty to use a placeholder image
                </small>
              </div>
              
              {/* Photo Preview */}
              {formData.photoUrl && (
                <div className={`${productStyles.formPreview} ${productStyles.fullWidth}`}>
                  <p className={productStyles.previewTitle}>Current Photo:</p>
                  <img 
                    src={formData.photoUrl} 
                    alt={formData.name}
                    className={productStyles.previewImage}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150x150?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </div>
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
              type="submit"
              className={styles.saveButton}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 