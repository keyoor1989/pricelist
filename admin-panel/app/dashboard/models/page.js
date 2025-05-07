'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './models.module.css';
import AddModelModal from '../../../components/models/AddModelModal';
import EditModelModal from '../../../components/models/EditModelModal';
import DeleteConfirmModal from '../../../components/models/DeleteConfirmModal';

// Sample brands data (in a real app, this would come from an API)
const availableBrands = [
  { id: 1, name: 'Toyota', logoUrl: 'https://via.placeholder.com/150x50?text=Toyota' },
  { id: 2, name: 'Honda', logoUrl: 'https://via.placeholder.com/150x50?text=Honda' },
  { id: 3, name: 'Maruti Suzuki', logoUrl: 'https://via.placeholder.com/150x50?text=Maruti+Suzuki' },
  { id: 4, name: 'Hyundai', logoUrl: 'https://via.placeholder.com/150x50?text=Hyundai' },
  { id: 5, name: 'Tata Motors', logoUrl: 'https://via.placeholder.com/150x50?text=Tata+Motors' },
];

// Sample models data (would come from API/database in real app)
const initialModels = [
  { id: 1, name: 'Corolla', brandId: 1 },
  { id: 2, name: 'Camry', brandId: 1 },
  { id: 3, name: 'City', brandId: 2 },
  { id: 4, name: 'Swift', brandId: 3 },
  { id: 5, name: 'Creta', brandId: 4 },
  { id: 6, name: 'Nexon', brandId: 5 },
];

export default function ModelsPage() {
  // State for models data
  const [models, setModels] = useState([]);
  // State for brands data
  const [brands, setBrands] = useState([]);
  
  // States for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  
  // States for loading and errors
  const [isModelsLoading, setIsModelsLoading] = useState(true);
  const [isBrandsLoading, setIsBrandsLoading] = useState(true);
  const [modelsError, setModelsError] = useState(null);
  const [brandsError, setBrandsError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch models from API
  const fetchModels = async () => {
    setIsModelsLoading(true);
    setModelsError(null);
    
    try {
      const response = await axios.get('/api/models');
      setModels(response.data);
    } catch (err) {
      console.error('Failed to fetch models:', err);
      setModelsError('Failed to load models. Please try again later.');
    } finally {
      setIsModelsLoading(false);
    }
  };
  
  // Fetch brands from API
  const fetchBrands = async () => {
    setIsBrandsLoading(true);
    setBrandsError(null);
    
    try {
      const response = await axios.get('/api/brands');
      setBrands(response.data);
    } catch (err) {
      console.error('Failed to fetch brands:', err);
      setBrandsError('Failed to load brands. Please try again later.');
    } finally {
      setIsBrandsLoading(false);
    }
  };
  
  // Load initial data
  useEffect(() => {
    fetchModels();
    fetchBrands();
  }, []);
  
  // Get brand name by brandId
  const getBrandName = (brandId) => {
    const brand = brands.find(brand => brand.id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };
  
  // Add new model
  const handleAddModel = async (model) => {
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/models', model);
      await fetchModels(); // Refresh the models list
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add model:', err);
      alert('Failed to add model. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Edit model
  const handleEditModel = async (updatedModel) => {
    setIsSubmitting(true);
    
    try {
      await axios.put(`/api/models/${updatedModel.id}`, updatedModel);
      await fetchModels(); // Refresh the models list
      setIsEditModalOpen(false);
      setCurrentModel(null);
    } catch (err) {
      console.error('Failed to update model:', err);
      alert('Failed to update model. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete model
  const handleDeleteModel = async () => {
    setIsSubmitting(true);
    
    try {
      await axios.delete(`/api/models/${currentModel.id}`);
      await fetchModels(); // Refresh the models list
      setIsDeleteModalOpen(false);
      setCurrentModel(null);
    } catch (err) {
      console.error('Failed to delete model:', err);
      alert('Failed to delete model. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open edit modal
  const openEditModal = (model) => {
    setCurrentModel(model);
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const openDeleteModal = (model) => {
    setCurrentModel(model);
    setIsDeleteModalOpen(true);
  };
  
  // Check if there's any loading or error
  const isLoading = isModelsLoading || isBrandsLoading;
  const hasError = modelsError || brandsError;
  
  return (
    <div className={styles.modelsContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Models Management</h1>
        <button 
          className={styles.addButton}
          onClick={() => setIsAddModalOpen(true)}
          disabled={isLoading || isSubmitting || hasError}
        >
          <span className={styles.addIcon}>+</span> Add Model
        </button>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading data...</p>
        </div>
      ) : hasError ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>
            {modelsError || brandsError}
          </p>
          <button 
            className={styles.retryButton}
            onClick={() => {
              fetchModels();
              fetchBrands();
            }}
          >
            Retry
          </button>
        </div>
      ) : models.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.modelsTable}>
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Linked Brand</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id}>
                  <td>{model.name}</td>
                  <td>{model.brand ? model.brand.name : getBrandName(model.brandId)}</td>
                  <td className={styles.actionsCell}>
                    <button 
                      className={styles.editButton}
                      onClick={() => openEditModal(model)}
                      disabled={isSubmitting}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => openDeleteModal(model)}
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
          <p>No models found. Click the "Add Model" button to add a new model.</p>
        </div>
      )}
      
      {/* Add Model Modal */}
      {isAddModalOpen && (
        <AddModelModal
          brands={brands}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddModel}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Edit Model Modal */}
      {isEditModalOpen && currentModel && (
        <EditModelModal
          model={currentModel}
          brands={brands}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentModel(null);
          }}
          onSave={handleEditModel}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentModel && (
        <DeleteConfirmModal
          model={currentModel}
          brandName={currentModel.brand ? currentModel.brand.name : getBrandName(currentModel.brandId)}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCurrentModel(null);
          }}
          onConfirm={handleDeleteModel}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
} 