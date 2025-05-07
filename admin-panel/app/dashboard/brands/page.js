'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './brands.module.css';
import AddBrandModal from '../../../components/brands/AddBrandModal';
import EditBrandModal from '../../../components/brands/EditBrandModal';
import DeleteConfirmModal from '../../../components/brands/DeleteConfirmModal';

export default function BrandsPage() {
  // State for brands data
  const [brands, setBrands] = useState([]);
  
  // States for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState(null);
  
  // States for loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch brands from API
  const fetchBrands = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/brands');
      setBrands(response.data);
    } catch (err) {
      console.error('Failed to fetch brands:', err);
      setError('Failed to load brands. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load initial data
  useEffect(() => {
    fetchBrands();
  }, []);
  
  // Add new brand
  const handleAddBrand = async (brand) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/brands', brand);
      await fetchBrands(); // Refresh the brands list
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add brand:', err);
      alert('Failed to add brand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Edit brand
  const handleEditBrand = async (updatedBrand) => {
    setIsSubmitting(true);
    
    try {
      const response = await axios.put(`/api/brands/${updatedBrand.id}`, updatedBrand);
      await fetchBrands(); // Refresh the brands list
      setIsEditModalOpen(false);
      setCurrentBrand(null);
    } catch (err) {
      console.error('Failed to update brand:', err);
      alert('Failed to update brand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete brand
  const handleDeleteBrand = async () => {
    setIsSubmitting(true);
    
    try {
      await axios.delete(`/api/brands/${currentBrand.id}`);
      await fetchBrands(); // Refresh the brands list
      setIsDeleteModalOpen(false);
      setCurrentBrand(null);
    } catch (err) {
      console.error('Failed to delete brand:', err);
      alert('Failed to delete brand. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open edit modal
  const openEditModal = (brand) => {
    setCurrentBrand(brand);
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const openDeleteModal = (brand) => {
    setCurrentBrand(brand);
    setIsDeleteModalOpen(true);
  };
  
  return (
    <div className={styles.brandsContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Brands Management</h1>
        <button 
          className={styles.addButton}
          onClick={() => setIsAddModalOpen(true)}
          disabled={isSubmitting}
        >
          <span className={styles.addIcon}>+</span> Add Brand
        </button>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading brands...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={fetchBrands}
          >
            Retry
          </button>
        </div>
      ) : brands.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.brandsTable}>
            <thead>
              <tr>
                <th>Brand Logo</th>
                <th>Brand Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td className={styles.logoCell}>
                    <img 
                      src={brand.logo || `https://via.placeholder.com/150x50?text=${encodeURIComponent(brand.name)}`} 
                      alt={brand.name} 
                      className={styles.brandLogo}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x50?text=No+Image';
                      }}
                    />
                  </td>
                  <td>{brand.name}</td>
                  <td className={styles.actionsCell}>
                    <button 
                      className={styles.editButton}
                      onClick={() => openEditModal(brand)}
                      disabled={isSubmitting}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => openDeleteModal(brand)}
                      disabled={isSubmitting}
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
          <p>No brands found. Click the "Add Brand" button to add a new brand.</p>
        </div>
      )}
      
      {/* Add Brand Modal */}
      {isAddModalOpen && (
        <AddBrandModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddBrand}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Edit Brand Modal */}
      {isEditModalOpen && currentBrand && (
        <EditBrandModal
          brand={{
            id: currentBrand.id,
            name: currentBrand.name,
            logoUrl: currentBrand.logo
          }}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentBrand(null);
          }}
          onSave={handleEditBrand}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentBrand && (
        <DeleteConfirmModal
          brand={{
            id: currentBrand.id,
            name: currentBrand.name,
            logoUrl: currentBrand.logo
          }}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCurrentBrand(null);
          }}
          onConfirm={handleDeleteBrand}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
} 