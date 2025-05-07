'use client';

import { useState, useRef } from 'react';
import { parse } from 'papaparse';
import styles from '../brands/ModalStyles.module.css';
import productStyles from './ProductModalStyles.module.css';
import axios from 'axios';

export default function BulkUploadModal({ 
  brands, 
  models, 
  categories, 
  existingProducts, 
  onClose, 
  onSave,
  isLoading = false
}) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [duplicateAction, setDuplicateAction] = useState('skip');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    total: 0,
    completed: 0,
    success: 0,
    skipped: 0,
    failed: 0
  });
  const [uploadErrors, setUploadErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Expected CSV headers
  const expectedHeaders = [
    'Product Name', 'Part Code', 'Brand', 'Model', 'Category',
    'Purchase Price', 'Dealer Price', 'End User Price', 'GST (%)', 'Photo URL'
  ];

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setUploadedFile(file);
      setErrors([]);
      setUploadErrors([]);
      parseCSV(file);
    } else {
      setUploadedFile(null);
      setErrors(['Please select a valid CSV file.']);
      setParsedData([]);
    }
  };

  // Parse CSV file
  const parseCSV = (file) => {
    setIsProcessing(true);
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        validateCSV(results.data);
        setIsProcessing(false);
      },
      error: (error) => {
        setErrors([`Error parsing CSV: ${error.message}`]);
        setIsProcessing(false);
        setParsedData([]);
      }
    });
  };

  // Validate CSV data
  const validateCSV = (data) => {
    const validationErrors = [];
    const validProducts = [];
    
    // Check if CSV has required headers
    const firstRow = data[0];
    if (firstRow) {
      const headers = Object.keys(firstRow);
      const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
      if (missingHeaders.length > 0) {
        validationErrors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
      }
    } else {
      validationErrors.push('CSV file is empty.');
    }

    // Validate each row
    data.forEach((row, index) => {
      const rowErrors = [];
      const rowNum = index + 1;

      // Check required fields
      if (!row['Product Name']) rowErrors.push(`Product Name is required`);
      if (!row['Brand']) rowErrors.push(`Brand is required`);
      if (!row['Model']) rowErrors.push(`Model is required`);
      if (!row['Category']) rowErrors.push(`Category is required`);
      if (!row['Purchase Price']) rowErrors.push(`Purchase Price is required`);
      if (!row['Dealer Price']) rowErrors.push(`Dealer Price is required`);
      if (!row['End User Price']) rowErrors.push(`End User Price is required`);

      // Validate numeric fields
      const purchasePrice = parseFloat(row['Purchase Price']);
      if (isNaN(purchasePrice) || purchasePrice < 0) {
        rowErrors.push(`Purchase Price must be a positive number`);
      }

      const dealerPrice = parseFloat(row['Dealer Price']);
      if (isNaN(dealerPrice) || dealerPrice < 0) {
        rowErrors.push(`Dealer Price must be a positive number`);
      }

      const endUserPrice = parseFloat(row['End User Price']);
      if (isNaN(endUserPrice) || endUserPrice < 0) {
        rowErrors.push(`End User Price must be a positive number`);
      }

      const gst = row['GST (%)'] ? parseFloat(row['GST (%)']) : 18;
      if (isNaN(gst) || gst < 0 || gst > 100) {
        rowErrors.push(`GST must be between 0 and 100`);
      }

      // Validate brand, model and category exist
      const brandExists = brands.some(brand => brand.name === row['Brand']);
      if (!brandExists) {
        rowErrors.push(`Brand "${row['Brand']}" doesn't exist in the system`);
      }

      // Find brand ID
      const brand = brands.find(brand => brand.name === row['Brand']);
      let brandId = brand ? brand.id : null;

      // Check if model exists for the selected brand
      if (brandId) {
        const modelExists = models.some(
          model => model.name === row['Model'] && model.brandId === brandId
        );
        if (!modelExists) {
          rowErrors.push(`Model "${row['Model']}" doesn't exist for brand "${row['Brand']}"`);
        }
      }

      // Find model ID
      const model = models.find(
        model => model.name === row['Model'] && model.brandId === brandId
      );
      let modelId = model ? model.id : null;

      // Check if category exists
      const categoryExists = categories.some(category => category.name === row['Category']);
      if (!categoryExists) {
        rowErrors.push(`Category "${row['Category']}" doesn't exist in the system`);
      }

      // Find category ID
      const category = categories.find(category => category.name === row['Category']);
      let categoryId = category ? category.id : null;

      // Add row errors to validation errors
      if (rowErrors.length > 0) {
        validationErrors.push(`Row ${rowNum}: ${rowErrors.join(', ')}`);
      } else {
        // Valid product
        validProducts.push({
          name: row['Product Name'],
          partCode: row['Part Code'] || '',
          brandId,
          modelId,
          categoryId,
          purchasePrice,
          dealerPrice,
          endUserPrice,
          gst: gst || 18,
          photoUrl: row['Photo URL'] || `https://via.placeholder.com/100x100?text=${encodeURIComponent(row['Product Name'])}`
        });
      }
    });

    // Check for duplicates
    const duplicates = validProducts.filter(product => 
      existingProducts.some(existingProduct => 
        existingProduct.name === product.name ||
        (product.partCode && existingProduct.partCode === product.partCode)
      )
    );
    
    if (duplicates.length > 0) {
      validationErrors.push(`Found ${duplicates.length} duplicate product(s). Select how to handle them below.`);
    }

    setErrors(validationErrors);
    setParsedData(validProducts);
  };

  // Process data for save
  const processDataForSave = () => {
    if (duplicateAction === 'skip') {
      // Skip existing products
      return parsedData.filter(product => 
        !existingProducts.some(existingProduct => 
          existingProduct.name === product.name ||
          (product.partCode && existingProduct.partCode === product.partCode)
        )
      );
    } else {
      // Update existing products by keeping new ones and marking duplicates for update
      return parsedData.map(product => {
        const existingProduct = existingProducts.find(existing => 
          existing.name === product.name ||
          (product.partCode && existing.partCode === product.partCode)
        );
        
        if (existingProduct) {
          return { ...product, id: existingProduct.id }; // Keep existing ID
        }
        return product;
      });
    }
  };

  // Process API upload for each product
  const uploadProductsToAPI = async (products) => {
    setIsUploading(true);
    setUploadProgress({
      total: products.length,
      completed: 0,
      success: 0,
      skipped: 0,
      failed: 0
    });
    setUploadErrors([]);

    const newUploadErrors = [];
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      try {
        // For update (has ID) use PUT, otherwise POST
        if (product.id) {
          await axios.put(`/api/products/${product.id}`, product);
          
          setUploadProgress(prev => ({
            ...prev,
            completed: prev.completed + 1,
            success: prev.success + 1
          }));
        } else {
          const response = await axios.post('/api/products', product);
          
          setUploadProgress(prev => ({
            ...prev,
            completed: prev.completed + 1,
            success: prev.success + 1
          }));
        }
      } catch (error) {
        console.error('Error uploading product:', error);
        
        // Get error message from API if available
        const errorMessage = error.response?.data?.error || error.message;
        
        newUploadErrors.push({
          product: product.name,
          error: errorMessage
        });
        
        setUploadProgress(prev => ({
          ...prev,
          completed: prev.completed + 1,
          failed: prev.failed + 1
        }));
      }
      
      // Update the upload errors state
      if (newUploadErrors.length > 0) {
        setUploadErrors(newUploadErrors);
      }
    }
    
    setIsUploading(false);
    
    // If completed successfully with no errors, call onSave to refresh the products list
    if (newUploadErrors.length === 0) {
      onSave([], duplicateAction);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (errors.length === 0 || (errors.length === 1 && errors[0].includes('duplicate'))) {
      const processedData = processDataForSave();
      
      if (processedData.length === 0) {
        alert('No products to upload after filtering duplicates.');
        return;
      }
      
      // Upload products to API one by one
      await uploadProductsToAPI(processedData);
    }
  };

  // Sample CSV data
  const sampleCSVData = `Product Name,Part Code,Brand,Model,Category,Purchase Price,Dealer Price,End User Price,GST (%),Photo URL
Air Filter,AF-2001,Toyota,Corolla,Sedan,250,300,350,18,https://example.com/airfilter.jpg
Oil Filter,OF-3001,Honda,City,Sedan,180,220,260,18,https://example.com/oilfilter.jpg`;

  // Download sample CSV
  const downloadSampleCSV = () => {
    const blob = new Blob([sampleCSVData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sample_products.csv';
    link.click();
  };

  // Calculate progress percentage
  const calculateProgressPercentage = () => {
    if (uploadProgress.total === 0) return 0;
    return Math.round((uploadProgress.completed / uploadProgress.total) * 100);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${productStyles.bulkUploadModalContent}`}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Bulk Upload Products</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
            disabled={isUploading || isLoading}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={`${styles.modalBody} ${productStyles.productModalBody}`}>
            {/* File Upload Section */}
            <div className={productStyles.uploadSection}>
              {!isUploading ? (
                <>
                  <div className={productStyles.fileInputContainer}>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className={productStyles.fileInput}
                      id="csvFileInput"
                      disabled={isUploading || isLoading}
                    />
                    <label htmlFor="csvFileInput" className={productStyles.fileInputLabel}>
                      {uploadedFile ? uploadedFile.name : 'Choose CSV File'}
                    </label>
                    <button 
                      type="button" 
                      className={productStyles.browseButton}
                      onClick={() => fileInputRef.current.click()}
                      disabled={isUploading || isLoading}
                    >
                      Browse
                    </button>
                  </div>
                  
                  <div className={productStyles.csvHelp}>
                    <p className={productStyles.csvHelpText}>
                      Upload a CSV file with the following columns: Product Name, Part Code, Brand, Model, Category, 
                      Purchase Price, Dealer Price, End User Price, GST (%), Photo URL
                    </p>
                    <button 
                      type="button" 
                      className={productStyles.sampleButton}
                      onClick={downloadSampleCSV}
                    >
                      Download Sample CSV
                    </button>
                  </div>
                </>
              ) : (
                <div className={productStyles.progressContainer}>
                  <h3 className={productStyles.progressTitle}>Uploading Products</h3>
                  <div className={productStyles.progressBarContainer}>
                    <div 
                      className={productStyles.progressBar}
                      style={{ width: `${calculateProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className={productStyles.progressStats}>
                    <div className={productStyles.progressStat}>
                      <span className={productStyles.progressLabel}>Completed:</span>
                      <span className={productStyles.progressValue}>
                        {uploadProgress.completed}/{uploadProgress.total}
                      </span>
                    </div>
                    <div className={productStyles.progressStat}>
                      <span className={productStyles.progressLabel}>Success:</span>
                      <span className={productStyles.progressSuccess}>{uploadProgress.success}</span>
                    </div>
                    <div className={productStyles.progressStat}>
                      <span className={productStyles.progressLabel}>Failed:</span>
                      <span className={productStyles.progressFailed}>{uploadProgress.failed}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Error Messages */}
              {errors.length > 0 && !isUploading && (
                <div className={productStyles.errorContainer}>
                  <h3 className={productStyles.errorTitle}>
                    Please fix the following errors:
                  </h3>
                  <ul className={productStyles.errorList}>
                    {errors.map((error, index) => (
                      <li key={index} className={productStyles.errorItem}>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Upload Error Messages */}
              {uploadErrors.length > 0 && (
                <div className={productStyles.errorContainer}>
                  <h3 className={productStyles.errorTitle}>
                    The following products failed to upload:
                  </h3>
                  <ul className={productStyles.errorList}>
                    {uploadErrors.map((error, index) => (
                      <li key={index} className={productStyles.errorItem}>
                        <strong>{error.product}</strong>: {error.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Duplicate Handling */}
              {parsedData.length > 0 && !isUploading && errors.some(error => error.includes('duplicate')) && (
                <div className={productStyles.duplicateOptions}>
                  <p className={productStyles.duplicateTitle}>How to handle duplicate products?</p>
                  <div className={productStyles.radioGroup}>
                    <label className={productStyles.radioLabel}>
                      <input 
                        type="radio" 
                        value="skip" 
                        checked={duplicateAction === 'skip'} 
                        onChange={() => setDuplicateAction('skip')} 
                        disabled={isUploading || isLoading}
                      />
                      Skip duplicates
                    </label>
                    <label className={productStyles.radioLabel}>
                      <input 
                        type="radio" 
                        value="update" 
                        checked={duplicateAction === 'update'} 
                        onChange={() => setDuplicateAction('update')} 
                        disabled={isUploading || isLoading}
                      />
                      Update duplicates
                    </label>
                  </div>
                </div>
              )}
              
              {/* Upload Summary */}
              {parsedData.length > 0 && !isUploading && (
                <div className={productStyles.uploadSummary}>
                  <p className={productStyles.summaryText}>
                    <strong>{parsedData.length}</strong> valid products ready to import
                  </p>
                </div>
              )}
              
              {/* Complete Upload Summary */}
              {uploadProgress.completed === uploadProgress.total && uploadProgress.total > 0 && !isUploading && (
                <div className={`${productStyles.uploadSummary} ${productStyles.uploadComplete}`}>
                  <p className={productStyles.summaryText}>
                    Upload complete: <strong>{uploadProgress.success}</strong> products uploaded successfully, 
                    <strong> {uploadProgress.failed}</strong> failed.
                  </p>
                  {uploadProgress.failed === 0 && (
                    <p className={productStyles.successMessage}>All products were uploaded successfully!</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.modalFooter}>
            {uploadProgress.completed === uploadProgress.total && uploadProgress.total > 0 && !isUploading ? (
              <button 
                type="button" 
                className={styles.saveButton}
                onClick={onClose}
              >
                Close
              </button>
            ) : (
              <>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={onClose}
                  disabled={isUploading || isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={parsedData.length === 0 || (errors.length > 0 && !errors.some(error => error.includes('duplicate'))) || isUploading || isLoading}
                >
                  {isUploading ? `Uploading (${calculateProgressPercentage()}%)` : 'Upload Products'}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 