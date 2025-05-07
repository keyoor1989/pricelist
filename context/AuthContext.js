import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API URL for the admin panel backend
const API_URL = 'http://192.168.29.214:3000/api';
// const API_URL = 'http://10.0.2.2:3000/api'; // For Android emulator
// const API_URL = 'http://localhost:3000/api'; // For iOS simulator

// Create the Auth Context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is already logged in from AsyncStorage
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  // Function to log in
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the authentication API
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }
      
      const userData = await response.json();
      
      // Store user data in state and AsyncStorage
      setUser(userData);
      setIsAuthenticated(true);
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to log out
  const logout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('user');
      
      // Update state
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const contextValue = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 