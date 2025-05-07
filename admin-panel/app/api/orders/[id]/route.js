import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// GET a single order by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                brand: true,
                model: true,
                category: true
              }
            }
          }
        }
      }
    });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PUT to update an order's status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Only allow status updates for now
    if (!data.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });
    
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Update the order
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        notes: data.notes !== undefined ? data.notes : existingOrder.notes
      },
      include: {
        customer: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE an order
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });
    
    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    // Only allow deleting pending orders
    if (existingOrder.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending orders can be deleted' },
        { status: 400 }
      );
    }
    
    // Delete order and all items (cascade delete will handle items)
    await prisma.order.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 