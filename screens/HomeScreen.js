import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  background: '#F3FEB8',
  yellow: '#FFDE4D',
  orange: '#FFB22C',
  red: '#FF4C4C',
};

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    // Navigation will be handled by App.js
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.welcomeText}>
          Welcome, <Text style={styles.roleText}>{user?.role || 'Guest'}</Text>
        </Text>
        <Text style={styles.emailText}>{user?.email || ''}</Text>
      </View>

      <Text style={styles.title}>Welcome to PriceListApp</Text>
      <Text style={styles.subtitle}>Your one-stop solution for product prices</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ProductFilter')}
      >
        <Text style={styles.buttonText}>Find Products</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  userInfoContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 4,
  },
  roleText: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  emailText: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: COLORS.orange,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: COLORS.yellow,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  logoutButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
}); 