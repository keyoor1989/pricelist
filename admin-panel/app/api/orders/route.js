import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// Helper function to generate an order number
function generateOrderNumber() {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `ORD-${year}${month}${day}-${random}`;
}

// GET all orders
export async function GET(request) {
  try {
    // Get search parameters
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    // Build filter conditions
    let where = {};
    
    if (customerId) {
      where.customerId = customerId;
    }
    
    if (status) {
      where.status = status;
    }
    
    const orders = await prisma.order.findMany({
      where,
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
                model: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST to create a new order
export async function POST(request) {
  try {
    const data = await request.json();
    const { items, customerId, userId, notes } = data;
    
    // Validate required fields
    if (!items || !items.length) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }
    
    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer is required' },
        { status: 400 }
      );
    }
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Generate order number
    const orderNumber = generateOrderNumber();
    
    // Fetch products to calculate prices
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    });
    
    // Map for quick product lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product.id] = product;
    });
    
    // Get customer info
    const customer = await prisma.customer.findUnique({
      where: { id: customerId }
    });
    
    // Calculate totals and prepare order items
    let totalAmount = 0;
    let gstAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = productMap[item.productId];
      
      if (!product) {
        throw new Error(`Product not found for ID: ${item.productId}`);
      }
      
      // Use appropriate price based on customer type
      let unitPrice = product.endUserPrice;
      if (customer && customer.type === 'DEALER') {
        unitPrice = product.dealerPrice;
      }
      
      const quantity = item.quantity;
      const totalPrice = unitPrice * quantity;
      
      // Add to order totals
      totalAmount += totalPrice;
      
      orderItems.push({
        productId: item.productId,
        quantity,
        unitPrice,
        totalPrice
      });
    }
    
    // Calculate GST
    const gstRate = 0.18; // 18% GST
    gstAmount = totalAmount * gstRate;
    const netAmount = totalAmount + gstAmount;
    
    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        userId,
        status: 'PENDING',
        totalAmount,
        gstAmount,
        netAmount,
        notes,
        items: {
          create: orderItems
        }
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
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json(
      { error: `Failed to create order: ${error.message}` },
      { status: 500 }
    );
  }
} 