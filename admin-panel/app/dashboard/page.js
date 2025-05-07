'use client';

import { useAuth } from '../../context/AuthContext';
import styles from './page.module.css';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Sample stats data (would come from an API in a real application)
  const stats = [
    { title: 'Total Products', value: '156', icon: '📦' },
    { title: 'Brands', value: '24', icon: '🏷️' },
    { title: 'Categories', value: '12', icon: '📁' },
    { title: 'Users', value: '45', icon: '👥' }
  ];
  
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.welcomeMessage}>Welcome, <span className={styles.userName}>{user?.email.split('@')[0] || 'Admin'}</span>!</p>
        <p className={styles.dateTime}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statIcon}>{stat.icon}</div>
            <div className={styles.statInfo}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statTitle}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>Recent Activity</h2>
        <div className={styles.activityCard}>
          <div className={styles.activityPlaceholder}>
            <p>Recent activity will be displayed here.</p>
            <p className={styles.placeholderNote}>This is a placeholder for future implementation.</p>
          </div>
        </div>
      </div>
      
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>➕</span>
            <span className={styles.actionText}>Add New Product</span>
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>👥</span>
            <span className={styles.actionText}>Manage Users</span>
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>⚙️</span>
            <span className={styles.actionText}>System Settings</span>
          </button>
          <button className={styles.actionButton}>
            <span className={styles.actionIcon}>📊</span>
            <span className={styles.actionText}>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
} 