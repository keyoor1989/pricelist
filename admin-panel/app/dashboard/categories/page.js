'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './categories.module.css';
import AddCategoryModal from '../../../components/categories/AddCategoryModal';
import EditCategoryModal from '../../../components/categories/EditCategoryModal';
import DeleteConfirmModal from '../../../components/categories/DeleteConfirmModal';

export default function CategoriesPage() {
  // State for categories data
  const [categories, setCategories] = useState([]);
  
  // States for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  
  // States for loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load initial data
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Add new category
  const handleAddCategory = async (category) => {
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/categories', category);
      await fetchCategories(); // Refresh the categories list
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Failed to add category:', err);
      alert('Failed to add category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Edit category
  const handleEditCategory = async (updatedCategory) => {
    setIsSubmitting(true);
    
    try {
      await axios.put(`/api/categories/${updatedCategory.id}`, updatedCategory);
      await fetchCategories(); // Refresh the categories list
      setIsEditModalOpen(false);
      setCurrentCategory(null);
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('Failed to update category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Delete category
  const handleDeleteCategory = async () => {
    setIsSubmitting(true);
    
    try {
      await axios.delete(`/api/categories/${currentCategory.id}`);
      await fetchCategories(); // Refresh the categories list
      setIsDeleteModalOpen(false);
      setCurrentCategory(null);
    } catch (err) {
      console.error('Failed to delete category:', err);
      
      // Check for products related to this category
      if (err.response && err.response.status === 400) {
        alert('Cannot delete this category because it has related products.');
      } else {
        alert('Failed to delete category. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Open edit modal
  const openEditModal = (category) => {
    setCurrentCategory(category);
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const openDeleteModal = (category) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };
  
  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Categories Management</h1>
        <button 
          className={styles.addButton}
          onClick={() => setIsAddModalOpen(true)}
          disabled={isLoading || isSubmitting}
        >
          <span className={styles.addIcon}>+</span> Add Category
        </button>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading categories...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={fetchCategories}
          >
            Retry
          </button>
        </div>
      ) : categories.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.categoriesTable}>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td className={styles.actionsCell}>
                    <button 
                      className={styles.editButton}
                      onClick={() => openEditModal(category)}
                      disabled={isSubmitting}
                    >
                      Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => openDeleteModal(category)}
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
          <p>No categories found. Click the "Add Category" button to add a new category.</p>
        </div>
      )}
      
      {/* Add Category Modal */}
      {isAddModalOpen && (
        <AddCategoryModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddCategory}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Edit Category Modal */}
      {isEditModalOpen && currentCategory && (
        <EditCategoryModal
          category={currentCategory}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentCategory(null);
          }}
          onSave={handleEditCategory}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentCategory && (
        <DeleteConfirmModal
          category={currentCategory}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCurrentCategory(null);
          }}
          onConfirm={handleDeleteCategory}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
} 