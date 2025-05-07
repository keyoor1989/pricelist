'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

// Navigation items for the sidebar
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Brands', path: '/dashboard/brands', icon: '🏷️' },
  { name: 'Models', path: '/dashboard/models', icon: '🚗' },
  { name: 'Categories', path: '/dashboard/categories', icon: '📁' },
  { name: 'Products', path: '/dashboard/products', icon: '📦' },
  { name: 'Customers', path: '/dashboard/customers', icon: '👤' },
  { name: 'Orders', path: '/dashboard/orders', icon: '🛒' },
  { name: 'Users', path: '/dashboard/users', icon: '👥' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>Admin Panel</h2>
        <div className={styles.userInfo}>
          <span className={styles.userRole}>Admin</span>
          <span className={styles.userEmail}>{user?.email}</span>
        </div>
      </div>
      
      <nav className={styles.sidebarNav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path} className={styles.navItem}>
              <Link
                href={item.path}
                className={`${styles.navLink} ${
                  pathname === item.path ? styles.active : ''
                }`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navText}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className={styles.sidebarFooter}>
        <button
          onClick={logout}
          className={styles.logoutButton}
        >
          <span className={styles.logoutIcon}>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 