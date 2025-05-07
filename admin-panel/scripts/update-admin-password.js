const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Updating admin password...');
    
    // Check if the admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: 'copierbazar@gmail.com' }
    });
    
    if (!adminUser) {
      console.log('Admin user not found');
      return;
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Keyoor@45080', salt);
    
    // Update the admin user's password
    const updatedUser = await prisma.user.update({
      where: { 
        id: adminUser.id 
      },
      data: {
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });
    
    console.log('Admin password updated successfully for:', updatedUser.email);
    console.log('Updated at:', updatedUser.updatedAt);
    
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 