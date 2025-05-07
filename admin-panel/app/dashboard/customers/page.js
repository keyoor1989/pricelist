"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import AddCustomerModal from '../../../components/customers/AddCustomerModal';
import EditCustomerModal from '../../../components/customers/EditCustomerModal';
import DeleteConfirmModal from '../../../components/customers/DeleteConfirmModal';
import styles from './customers.module.css';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, filterType]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      
      let url = '/api/customers';
      const params = new URLSearchParams();
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      
      if (filterType) {
        params.append('type', filterType);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching customers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = async (newCustomer) => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create customer');
      }

      const createdCustomer = await response.json();
      setCustomers([...customers, createdCustomer]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error creating customer:', err);
      alert(err.message);
    }
  };

  const handleEditCustomer = async (updatedCustomer) => {
    try {
      const response = await fetch(`/api/customers/${updatedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCustomer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update customer');
      }

      const savedCustomer = await response.json();
      
      setCustomers(customers.map(c => 
        c.id === savedCustomer.id ? savedCustomer : c
      ));
      
      setShowEditModal(false);
      setCurrentCustomer(null);
    } catch (err) {
      console.error('Error updating customer:', err);
      alert(err.message);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete customer');
      }

      setCustomers(customers.filter(c => c.id !== id));
      setShowDeleteModal(false);
      setCurrentCustomer(null);
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert(err.message);
    }
  };

  const openEditModal = (customer) => {
    setCurrentCustomer(customer);
    setShowEditModal(true);
  };

  const openDeleteModal = (customer) => {
    setCurrentCustomer(customer);
    setShowDeleteModal(true);
  };

  const getCustomerTypeLabel = (type) => {
    switch (type) {
      case 'DEALER':
        return 'Dealer';
      case 'END_USER':
        return 'End User';
      default:
        return type;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customers</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus /> Add Customer
        </button>
      </div>
      
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterBox}>
          <FaFilter className={styles.filterIcon} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Types</option>
            <option value="DEALER">Dealers</option>
            <option value="END_USER">End Users</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading customers...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchCustomers}>Try Again</button>
        </div>
      ) : customers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No customers found.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className={styles.addEmptyButton}
          >
            Add your first customer
          </button>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email || '—'}</td>
                  <td>{customer.phone || '—'}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[customer.type.toLowerCase()]}`}>
                      {getCustomerTypeLabel(customer.type)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => openEditModal(customer)}
                        className={styles.editButton}
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => openDeleteModal(customer)}
                        className={styles.deleteButton}
                        aria-label="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCustomer}
        />
      )}
      
      {showEditModal && currentCustomer && (
        <EditCustomerModal
          customer={currentCustomer}
          onClose={() => {
            setShowEditModal(false);
            setCurrentCustomer(null);
          }}
          onSave={handleEditCustomer}
        />
      )}
      
      {showDeleteModal && currentCustomer && (
        <DeleteConfirmModal
          itemName={currentCustomer.name}
          itemType="customer"
          onClose={() => {
            setShowDeleteModal(false);
            setCurrentCustomer(null);
          }}
          onDelete={() => handleDeleteCustomer(currentCustomer.id)}
        />
      )}
    </div>
  );
} 