import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  background: '#F3FEB8',
  yellow: '#FFDE4D',
  orange: '#FFB22C',
  red: '#FF4C4C',
};

// API URL for the admin panel backend - use appropriate URL based on your setup
// If using an emulator, use 10.0.2.2 for Android or localhost for iOS
// If using a physical device, use your computer's actual IP address on the same network
const API_URL = 'http://192.168.29.214:3000/api'; // Physical device
// const API_URL = 'http://10.0.2.2:3000/api'; // Android emulator
// const API_URL = 'http://localhost:3000/api'; // iOS simulator

export default function ProductFilterScreen({ navigation }) {
  const { user } = useAuth();
  
  // Filter state
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // States for dropdown data
  const [brands, setBrands] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableModels, setAvailableModels] = useState(['']);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filter data from API
  const fetchFilterData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Attempting to fetch products from: ${API_URL}/products`);
      
      // Fetch products from backend
      const response = await fetch(`${API_URL}/products`);
      
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.length} products from API`);
      
      // Transform data to match the app's expected format
      const transformedData = data.map(product => ({
        id: product.id,
        brand: product.brand?.name || 'Unknown',
        model: product.model?.name || 'Unknown',
        category: product.category?.name || 'Unknown',
        brandId: product.brandId,
        modelId: product.modelId,
        categoryId: product.categoryId
      }));
      
      // Extract unique values for filters
      const uniqueBrands = ['', ...new Set(transformedData.map(p => p.brand))];
      const uniqueModels = transformedData.map(p => ({ 
        name: p.model, 
        brandId: p.brandId 
      }));
      const uniqueCategories = ['', ...new Set(transformedData.map(p => p.category))];
      
      setBrands(uniqueBrands);
      setAllModels(uniqueModels);
      setCategories(uniqueCategories);
      
    } catch (err) {
      console.error('Error fetching filter data:', err.message);
      setError(`Failed to load filter data: ${err.message}`);
      
      // Set empty data in case of error
      setBrands(['']);
      setCategories(['']);
      setAllModels([]);
      setAvailableModels(['']);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchFilterData();
  }, []);

  // Get available models based on selected brand
  useEffect(() => {
    if (!selectedBrand) {
      setAvailableModels(['']);
      return;
    }
    
    const filteredModels = ['', ...new Set(
      allModels
        .filter(model => {
          // Find a product with this model that matches the selected brand
          const productWithModel = allModels.find(m => 
            m.name === model.name && 
            brands.indexOf(selectedBrand) !== -1
          );
          return !!productWithModel;
        })
        .map(model => model.name)
    )];
    
    setAvailableModels(filteredModels);
  }, [selectedBrand, allModels]);

  // Reset model when brand changes
  useEffect(() => {
    setSelectedModel('');
  }, [selectedBrand]);

  // Handle search button press
  const handleSearch = () => {
    // Navigate to product list with filter params
    navigation.navigate('ProductList', {
      selectedBrand,
      selectedModel,
      selectedCategory,
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.orange} />
        <Text style={styles.loadingText}>Loading filters...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={[styles.button, styles.retryButton]}
          onPress={fetchFilterData}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Filters</Text>
      <Text style={styles.subtitle}>Select filters to find products</Text>
      
      <View style={styles.filtersContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Brand</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedBrand}
              onValueChange={(value) => setSelectedBrand(value)}
              style={styles.picker}
              mode="dropdown"
            >
              {brands.map((brand, index) => (
                <Picker.Item 
                  key={index} 
                  label={brand || "All Brands"} 
                  value={brand} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Model</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedModel}
              onValueChange={(value) => setSelectedModel(value)}
              style={styles.picker}
              enabled={!!selectedBrand}
              mode="dropdown"
            >
              {availableModels.map((model, index) => (
                <Picker.Item 
                  key={index} 
                  label={model || "All Models"} 
                  value={model} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
              style={styles.picker}
              mode="dropdown"
            >
              {categories.map((category, index) => (
                <Picker.Item 
                  key={index} 
                  label={category || "All Categories"} 
                  value={category} 
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleSearch}
        >
          <Text style={styles.buttonText}>Search Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]}
          onPress={() => {
            setSelectedBrand('');
            setSelectedModel('');
            setSelectedCategory('');
          }}
        >
          <Text style={styles.resetButtonText}>Reset Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterItem: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#444',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    color: '#000000',
    fontWeight: '500',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: COLORS.orange,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: COLORS.yellow,
  },
  resetButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: COLORS.red,
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.yellow,
    marginTop: 10,
  },
}); 