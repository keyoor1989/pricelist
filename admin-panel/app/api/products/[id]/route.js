import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET a specific product
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        model: true,
        category: true,
      },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT to update a product
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Update the product
    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        brand: true,
        model: true,
        category: true,
      },
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE a product
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await prisma.product.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 