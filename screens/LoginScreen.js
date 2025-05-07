import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  background: '#F3FEB8',
  yellow: '#FFDE4D',
  orange: '#FFB22C',
  red: '#FF4C4C',
};

export default function LoginScreen({ navigation }) {
  const { login, error: authError, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }
    
    setError('');
    const result = await login(email, password);
    
    if (!result) {
      // Authentication failed, error is already set in the auth context
      setError(authError || 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View 
          style={styles.logo}
        />
        <Text style={styles.appTitle}>PriceListApp</Text>
        <Text style={styles.subtitle}>Login to access product prices</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!authLoading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!authLoading}
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity 
          style={[styles.loginButton, authLoading && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={authLoading}
        >
          {authLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Please contact your administrator if you need access to the app.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    backgroundColor: '#ddd', // Placeholder background
    borderRadius: 50,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    color: COLORS.red,
    marginBottom: 15,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
}); 