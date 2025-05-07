import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const COLORS = {
  background: '#F3FEB8',
  yellow: '#FFDE4D',
  orange: '#FFB22C',
  red: '#FF4C4C',
};

// Format price as Indian Rupees
const formatPrice = (price) => {
  return `₹${price.toFixed(2)}`;
};

// Calculate price with GST
const calculatePriceWithGST = (price, gstPercentage) => {
  return price + (price * gstPercentage / 100);
};

export default function ProductShareCard({ product }) {
  const priceWithGST = calculatePriceWithGST(product.endUserPrice, product.gstPercentage);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PriceListApp</Text>
      </View>
      
      <View style={styles.content}>
        <Image 
          source={{ uri: product.photo }} 
          style={styles.productImage}
        />
        
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.productName}</Text>
          
          {product.partCode && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Part Code:</Text>
              <Text style={styles.detailValue}>{product.partCode}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Brand:</Text>
            <Text style={styles.detailValue}>{product.brand}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Model:</Text>
            <Text style={styles.detailValue}>{product.model}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{product.category}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.priceContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.priceValue}>{formatPrice(product.endUserPrice)}</Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Price (with 18% GST):</Text>
          <Text style={styles.priceValue}>{formatPrice(priceWithGST)}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For more information, please contact us
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 600,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    backgroundColor: COLORS.yellow,
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 20,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: '#f0f0f0',
  },
  productDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    width: 100,
    color: '#555',
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  priceContainer: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.red,
  },
  footer: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 14,
    color: '#777',
  },
}); 