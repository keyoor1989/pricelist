import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET all brands
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        models: true,
      },
    });
    
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Failed to fetch brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

// POST to create a new brand
export async function POST(request) {
  try {
    const data = await request.json();
    
    const brand = await prisma.brand.create({
      data,
    });
    
    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    console.error('Failed to create brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    );
  }
}

// PUT to update a brand
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;
    
    const brand = await prisma.brand.update({
      where: { id },
      data: updateData,
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