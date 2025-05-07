import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET all models
export async function GET(request) {
  try {
    // Get searchParams from URL
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    
    // If brandId is provided, filter models by brand
    const where = brandId ? { brandId } : {};
    
    const models = await prisma.model.findMany({
      where,
      include: {
        brand: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(models);
  } catch (error) {
    console.error('Failed to fetch models:', error);
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

// POST to create a new model
export async function POST(request) {
  try {
    const data = await request.json();
    
    const model = await prisma.model.create({
      data,
      include: {
        brand: true,
      },
    });
    
    return NextResponse.json(model, { status: 201 });
  } catch (error) {
    console.error('Failed to create model:', error);
    return NextResponse.json(
      { error: 'Failed to create model' },
      { status: 500 }
    );
  }
} 