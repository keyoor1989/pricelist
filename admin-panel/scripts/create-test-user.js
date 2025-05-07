const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating a test user...');
    
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'enduser@example.com' }
    });
    
    if (existingUser) {
      console.log('User with this email already exists');
      return;
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        email: 'enduser@example.com',
        password: hashedPassword,
        name: 'Test End User',
        role: 'enduser',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });
    
    console.log('User created successfully:', user);
    
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 