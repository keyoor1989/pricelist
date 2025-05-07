import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET all customers
export async function GET(request) {
  try {
    // Get search parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    
    // Build filter conditions
    let where = {};
    
    if (type) {
      where.type = type;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } }
      ];
    }
    
    const customers = await prisma.customer.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST to create a new customer
export async function POST(request) {
  try {
    const data = await request.json();
    
    const customer = await prisma.customer.create({
      data,
    });
    
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    console.error('Failed to create customer:', error);
    
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A customer with this email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
} 