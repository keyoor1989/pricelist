'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in (via cookie)
  useEffect(() => {
    const userCookie = Cookies.get('admin_user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    // Hardcoded credentials check
    if (email === 'admin@demo.com' && password === 'password123') {
      const userData = { email, role: 'admin' };
      setUser(userData);
      
      // Store user data in cookie (expires in 1 day)
      Cookies.set('admin_user', JSON.stringify(userData), { expires: 1 });
      
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    Cookies.remove('admin_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 