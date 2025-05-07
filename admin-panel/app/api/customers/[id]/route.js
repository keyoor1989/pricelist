import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET a single customer by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5 // Include the 5 most recent orders
        }
      }
    });
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT to update a customer
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const customer = await prisma.customer.update({
      where: { id },
      data,
    });
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Failed to update customer:', error);
    
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A customer with this email already exists' },
        { status: 400 }
      );
    }
    
    // Check if customer not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE a customer
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if customer has orders
    const customerWithOrders = await prisma.customer.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });
    
    if (customerWithOrders?._count.orders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete customer with existing orders' },
        { status: 400 }
      );
    }
    
    await prisma.customer.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete customer:', error);
    
    // Check if customer not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
} 