import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET all products
export async function GET(request) {
  try {
    // Get search parameters
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const modelId = searchParams.get('modelId');
    const categoryId = searchParams.get('categoryId');
    
    // Build filter conditions
    let where = {};
    if (brandId) where.brandId = brandId;
    if (modelId) where.modelId = modelId;
    if (categoryId) where.categoryId = categoryId;
    
    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        model: true,
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST to create a new product
export async function POST(request) {
  try {
    const data = await request.json();
    console.log('Received product data:', data);
    
    // Ensure GST is a number, not a string
    if (data.gst === undefined || data.gst === null) {
      data.gst = 18;
    } else {
      data.gst = parseFloat(data.gst);
    }
    
    // Generate a placeholder image URL if not provided
    if (!data.photoUrl) {
      data.photoUrl = `https://via.placeholder.com/100x100?text=${encodeURIComponent(data.name)}`;
    }
    
    // Make sure all required fields are present
    ['name', 'brandId', 'modelId', 'categoryId', 'purchasePrice', 'dealerPrice', 'endUserPrice'].forEach(field => {
      if (!data[field] && data[field] !== 0) {
        console.error(`Missing required field: ${field}`);
      }
    });
    
    console.log('Attempting to create product with data:', data);
    
    const product = await prisma.product.create({
      data,
      include: {
        brand: true,
        model: true,
        category: true,
      },
    });
    
    console.log('Product created successfully:', product);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product. Error details:', error);
    
    // Return more detailed error message
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        message: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
} 