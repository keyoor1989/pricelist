import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Share,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
// Import the new packages
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import ProductShareCard from '../components/ProductShareCard';

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

export default function ProductListScreen({ route, navigation }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shareLoading, setShareLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ViewShot reference
  const viewShotRef = useRef(null);
  
  // Role-based display permission
  const canViewPurchasePrice = user?.role === 'admin' || user?.role === 'dealer';
  
  // Get filter params from navigation
  const { selectedBrand, selectedModel, selectedCategory } = route.params || {};

  // Fetch products from API
  const fetchProducts = async () => {
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
        productName: product.name,
        partCode: product.partCode || '',
        purchasePrice: product.purchasePrice,
        dealerPrice: product.dealerPrice,
        endUserPrice: product.endUserPrice,
        gstPercentage: product.gst,
        photo: product.photoUrl || 'https://via.placeholder.com/150',
        brand: product.brand?.name || 'Unknown',
        model: product.model?.name || 'Unknown',
        category: product.category?.name || 'Unknown',
        brandId: product.brandId,
        modelId: product.modelId,
        categoryId: product.categoryId
      }));
      
      setProducts(transformedData);
      
      // Apply filters from navigation params immediately
      let result = transformedData;
      
      // Apply brand filter
      if (selectedBrand) {
        result = result.filter(product => product.brand === selectedBrand);
      }
      
      // Apply model filter
      if (selectedModel) {
        result = result.filter(product => product.model === selectedModel);
      }
      
      // Apply category filter
      if (selectedCategory) {
        result = result.filter(product => product.category === selectedCategory);
      }
      
      setFilteredProducts(result);
      
    } catch (err) {
      console.error('Error fetching products:', err.message);
      setError(`Failed to load products: ${err.message}`);
      
      // Set empty data in case of error
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply search filter when search query changes
  useEffect(() => {
    if (products.length === 0) return;
    
    let result = products;
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      result = result.filter(product => {
        const nameMatch = product.productName.toLowerCase().includes(searchQuery.toLowerCase());
        const codeMatch = product.partCode && 
          product.partCode.toLowerCase().includes(searchQuery.toLowerCase());
        
        return nameMatch || codeMatch;
      });
    }
    
    // Apply brand filter
    if (selectedBrand) {
      result = result.filter(product => product.brand === selectedBrand);
    }
    
    // Apply model filter
    if (selectedModel) {
      result = result.filter(product => product.model === selectedModel);
    }
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, products, selectedBrand, selectedModel, selectedCategory]);

  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  // Calculate price with GST
  const calculatePriceWithGST = (price, gstPercentage) => {
    return price + (price * gstPercentage / 100);
  };

  // Format price as Indian Rupees
  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  // Modify the share functions to use basic Share API
  const shareProductAsText = async (product) => {
    try {
      const message = `
Product: ${product.productName}
${product.partCode ? `Part Code: ${product.partCode}` : ''}
Brand: ${product.brand}
Model: ${product.model}
Category: ${product.category}
Price: ${formatPrice(calculatePriceWithGST(product.endUserPrice, product.gstPercentage))}
`;
      
      await Share.share({
        message,
        title: product.productName,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to share product');
      console.error(error);
    }
  };
  
  const shareProduct = async (product) => {
    // Use text-based sharing directly for now until we fix the navigation issue
    shareProductAsText(product);
  };
  
  const captureAndShareImage = async () => {
    try {
      setShareLoading(true);
      
      if (!viewShotRef.current) {
        throw new Error('ViewShot ref is null');
      }
      
      // Capture the view
      const uri = await viewShotRef.current.capture();
      
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        // Fallback to text sharing
        if (selectedProduct) {
          shareProductAsText(selectedProduct);
        }
      }
    } catch (error) {
      console.error('Error capturing or sharing image:', error);
      // Fallback to text sharing
      if (selectedProduct) {
        shareProductAsText(selectedProduct);
      }
    } finally {
      setShareLoading(false);
      setShareModalVisible(false);
    }
  };
  
  // UseEffect to capture and share when modal is visible
  useEffect(() => {
    if (shareModalVisible && selectedProduct && !shareLoading) {
      setShareLoading(true);
      
      // Small delay to ensure view is rendered
      const timer = setTimeout(() => {
        captureAndShareImage();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [shareModalVisible, selectedProduct]);

  const renderProductItem = ({ item }) => {
    const priceWithGST = calculatePriceWithGST(item.endUserPrice, item.gstPercentage);
    const dealerPriceWithGST = calculatePriceWithGST(item.dealerPrice, item.gstPercentage);
    const purchasePriceWithGST = calculatePriceWithGST(item.purchasePrice, item.gstPercentage);
    
    return (
      <View style={styles.productCard}>
        <View style={styles.productHeader}>
          <Image source={{ uri: item.photo }} style={styles.productImage} />
          <View style={styles.headerInfo}>
            <Text style={styles.productName}>{item.productName}</Text>
            {item.partCode && (
              <Text style={styles.partCode}>Part Code: {item.partCode}</Text>
            )}
            <View style={styles.productMeta}>
              <Text style={styles.metaText}>Brand: {item.brand}</Text>
              <Text style={styles.metaText}>Model: {item.model}</Text>
              <View style={[
                styles.categoryBadge, 
                { backgroundColor: item.category === 'Original Consumables' ? '#E0F2F1' : '#FFF3E0' }
              ]}>
                <Text style={[
                  styles.categoryText, 
                  { color: item.category === 'Original Consumables' ? '#00897B' : '#FF8F00' }
                ]}>
                  {item.category}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          {canViewPurchasePrice && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Purchase Price:</Text>
              <View style={styles.priceValues}>
                <Text style={styles.priceValue}>{formatPrice(item.purchasePrice)}</Text>
                <Text style={styles.gstPrice}>With GST: {formatPrice(purchasePriceWithGST)}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Dealer Price:</Text>
            <View style={styles.priceValues}>
              <Text style={styles.priceValue}>{formatPrice(item.dealerPrice)}</Text>
              <Text style={styles.gstPrice}>With GST: {formatPrice(dealerPriceWithGST)}</Text>
            </View>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>End User Price:</Text>
            <View style={styles.priceValues}>
              <Text style={[styles.priceValue, styles.highlightedPrice]}>{formatPrice(item.endUserPrice)}</Text>
              <Text style={[styles.gstPrice, styles.highlightedPrice]}>With GST: {formatPrice(priceWithGST)}</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => shareProduct(item)}
        >
          <Text style={styles.shareButtonText}>Share Price</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by product name or part code"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.orange} />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={[styles.resetButton, styles.retryButton]}
            onPress={fetchProducts}
          >
            <Text style={styles.resetButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found matching your criteria.</Text>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.resetButtonText}>Back to Filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
      
      {/* Modal for capturing the share card */}
      <Modal
        transparent={true}
        visible={shareModalVisible}
        animationType="none"
        onRequestClose={() => {
          setShareModalVisible(false);
          setShareLoading(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.orange} />
            <Text style={styles.loadingText}>Preparing to share...</Text>
          </View>
          
          {/* This view will be captured but not shown to the user */}
          <View style={styles.hiddenView}>
            <ViewShot
              ref={viewShotRef}
              options={{
                format: 'png',
                quality: 1,
              }}
            >
              {selectedProduct && (
                <ProductShareCard product={selectedProduct} />
              )}
            </ViewShot>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: COLORS.yellow,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  filtersContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterItem: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    color: '#000000',
    fontWeight: '500',
  },
  listContent: {
    padding: 10,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  partCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productMeta: {
    marginTop: 4,
  },
  metaText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 3,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priceContainer: {
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
    width: '40%',
  },
  priceValues: {
    width: '60%',
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  gstPrice: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  highlightedPrice: {
    color: COLORS.red,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: COLORS.orange,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  resetButton: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#000',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  hiddenView: {
    position: 'absolute',
    left: -9999,
    top: -9999,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.red,
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
}); 