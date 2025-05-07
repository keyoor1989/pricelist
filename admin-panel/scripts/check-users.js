const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking for users in the database...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Found ${users.length} users:`);
      users.forEach(user => {
        console.log(`- ${user.email} (${user.role}) - ID: ${user.id}`);
      });
      
      // Log the full user data for debugging
      console.log('\nFull user data:');
      console.log(JSON.stringify(users, null, 2));
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 