import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET a single model by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const model = await prisma.model.findUnique({
      where: { id },
      include: {
        brand: true,
      },
    });
    
    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(model);
  } catch (error) {
    console.error('Failed to fetch model:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model' },
      { status: 500 }
    );
  }
}

// PUT to update a model
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const model = await prisma.model.update({
      where: { id },
      data,
      include: {
        brand: true,
      },
    });
    
    return NextResponse.json(model);
  } catch (error) {
    console.error('Failed to update model:', error);
    return NextResponse.json(
      { error: 'Failed to update model' },
      { status: 500 }
    );
  }
}

// DELETE a model
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await prisma.model.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete model:', error);
    return NextResponse.json(
      { error: 'Failed to delete model' },
      { status: 500 }
    );
  }
} 