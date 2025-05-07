'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './products.module.css';
import productStyles from '../../../components/products/ProductModalStyles.module.css';
import AddProductModal from '../../../components/products/AddProductModal';
import EditProductModal from '../../../components/products/EditProductModal';
import DeleteConfirmModal from '../../../components/products/DeleteConfirmModal';
import BulkUploadModal from '../../../components/products/BulkUploadModal';

export default function ProductsPage() {
  // State for data
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // State for loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // States for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch products
      const productsResponse = await axios.get('/api/products');
      setProducts(productsResponse.data);
      
      // Fetch brands
      const brandsResponse = await axios.get('/api/brands');
      setBrands(brandsResponse.data);
      
      // Fetch models
      const modelsResponse = await axios.get('/api/models');
      setModels(modelsResponse.data);
      
      // Fetch categories
      const categoriesResponse = await axios.get('/api/categories');
      setCategories(categoriesResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);
  
  // Helper functions to get names by IDs
  const getBrandName = (brandId) => {
    const brand = brands.find(brand => brand.id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };
  
  const getModelName = (modelId) => {
    const model = models.find(model => model.id === modelId);
    return model ? model.name : 'Unknown Model';
  };
  
  const getCategoryName = (categoryId) => {
    const category = categories.find(category => category.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };
  
  // Add new product
  const handleAddProduct = async (product) => {
    setSubmitLoading(true);
    try {
      const response = await axios.post('/api/products', product);
      setProducts([...products, response.data]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding product:', err);
      alert('Failed to add product. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // Edit product
  const handleEditProduct = async (updatedProduct) => {
    setSubmitLoading(true);
    try {
      const response = await axios.put(`/api/products/${updatedProduct.id}`, updatedProduct);
      setProducts(products.map(product => 
        product.id === updatedProduct.id ? response.data : product
      ));
      setIsEditModalOpen(false);
      setCurrentProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // Delete product
  const handleDeleteProduct = async () => {
    setSubmitLoading(true);
    try {
      await axios.delete(`/api/products/${currentProduct.id}`);
      setProducts(products.filter(product => product.id !== currentProduct.id));
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };
  
  // Open edit modal
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const openDeleteModal = (product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };
  
  // Format price as currency
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  
  // Handle bulk upload
  const handleBulkUpload = async (uploadedProducts, duplicateAction) => {
    // This function is now primarily used to refresh the products list
    // The actual upload is handled by BulkUploadModal
    fetchData();
    setIsBulkUploadModalOpen(false);
  };
  
  return (
    <div className={styles.productsContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Products Management</h1>
        <div className={styles.actionButtons}>
          <button 
            className={productStyles.bulkUploadButton}
            onClick={() => setIsBulkUploadModalOpen(true)}
            disabled={loading || submitLoading}
          >
            <span className={productStyles.uploadIcon}>📤</span> Bulk Upload CSV
          </button>
          <button 
            className={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading || submitLoading}
          >
            <span className={styles.addIcon}>+</span> Add Product
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={fetchData}
          >
            Retry
          </button>
        </div>
      ) : products.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.productsTable}>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Product Name</th>
                <th>Part Code</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Category</th>
                <th>Purchase Price</th>
                <th>Dealer Price</th>
                <th>End User Price</th>
                <th>GST (%)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className={styles.photoCell}>
                    <img 
                      src={product.photoUrl} 
                      alt={product.name}
                      className={styles.productThumbnail}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.partCode || '-'}</td>
                  <td>{product.brand ? product.brand.name : getBrandName(product.brandId)}</td>
                  <td>{product.model ? product.model.name : getModelName(product.modelId)}</td>
                  <td>{product.category ? product.category.name : getCategoryName(product.categoryId)}</td>
                  <td>{formatPrice(product.purchasePrice)}</td>
                  <td>{formatPrice(product.dealerPrice)}</td>
                  <td>{formatPrice(product.endUserPrice)}</td>
                  <td>{product.gst}%</td>
                  <td className={styles.actionsCell}>
                    <button 
                      className={styles.editButton}
                      onClick={() => openEditModal(product)}
                      disabled={submitLoading}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => openDeleteModal(product)}
                      disabled={submitLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.noData}>
          <p>No products found. Click the "Add Product" button to add a new product.</p>
        </div>
      )}
      
      {/* Add Product Modal */}
      {isAddModalOpen && (
        <AddProductModal
          brands={brands}
          models={models}
          categories={categories}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
          isLoading={submitLoading}
        />
      )}
      
      {/* Edit Product Modal */}
      {isEditModalOpen && currentProduct && (
        <EditProductModal
          product={currentProduct}
          brands={brands}
          models={models}
          categories={categories}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentProduct(null);
          }}
          onSave={handleEditProduct}
          isLoading={submitLoading}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentProduct && (
        <DeleteConfirmModal
          product={currentProduct}
          brandName={currentProduct.brand ? currentProduct.brand.name : getBrandName(currentProduct.brandId)}
          modelName={currentProduct.model ? currentProduct.model.name : getModelName(currentProduct.modelId)}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCurrentProduct(null);
          }}
          onConfirm={handleDeleteProduct}
          isLoading={submitLoading}
        />
      )}
      
      {/* Bulk Upload Modal */}
      {isBulkUploadModalOpen && (
        <BulkUploadModal
          brands={brands}
          models={models}
          categories={categories}
          existingProducts={products}
          onClose={() => setIsBulkUploadModalOpen(false)}
          onSave={handleBulkUpload}
          isLoading={submitLoading}
        />
      )}
    </div>
  );
}