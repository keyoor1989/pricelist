import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET a single brand by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        models: true,
      },
    });
    
    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(brand);
  } catch (error) {
    console.error('Failed to fetch brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    );
  }
}

// PUT to update a brand
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const brand = await prisma.brand.update({
      where: { id },
      data,
    });
    
    return NextResponse.json(brand);
  } catch (error) {
    console.error('Failed to update brand:', error);
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    );
  }
}

// DELETE a brand
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await prisma.brand.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand' },
      { status: 500 }
    );
  }
} 