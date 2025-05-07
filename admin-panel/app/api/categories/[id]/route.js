import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET a single category by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const category = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT to update a category
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const category = await prisma.category.update({
      where: { id },
      data,
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to update category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE a category
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if category has related products before deletion
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    });
    
    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category that has related products' },
        { status: 400 }
      );
    }
    
    await prisma.category.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 