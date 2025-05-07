const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed the database...');

  // Create brands
  const toyota = await prisma.brand.upsert({
    where: { name: 'Toyota' },
    update: {},
    create: {
      name: 'Toyota',
      logo: 'https://via.placeholder.com/150x50?text=Toyota'
    },
  });

  const honda = await prisma.brand.upsert({
    where: { name: 'Honda' },
    update: {},
    create: {
      name: 'Honda',
      logo: 'https://via.placeholder.com/150x50?text=Honda'
    },
  });

  const maruti = await prisma.brand.upsert({
    where: { name: 'Maruti Suzuki' },
    update: {},
    create: {
      name: 'Maruti Suzuki',
      logo: 'https://via.placeholder.com/150x50?text=Maruti+Suzuki'
    },
  });

  // Add Xerox brand
  const xerox = await prisma.brand.upsert({
    where: { name: 'Xerox' },
    update: {},
    create: {
      name: 'Xerox',
      logo: 'https://via.placeholder.com/150x50?text=Xerox'
    },
  });

  // Create categories
  const originalConsumables = await prisma.category.upsert({
    where: { name: 'Original Consumables' },
    update: {},
    create: {
      name: 'Original Consumables',
    },
  });

  const compatibleConsumables = await prisma.category.upsert({
    where: { name: 'Compatible Consumables' },
    update: {},
    create: {
      name: 'Compatible Consumables',
    },
  });

  // Create models for Toyota
  const innova = await prisma.model.upsert({
    where: { 
      name_brandId: {
        name: 'Innova',
        brandId: toyota.id
      }
    },
    update: {},
    create: {
      name: 'Innova',
      brandId: toyota.id,
    },
  });

  const fortuner = await prisma.model.upsert({
    where: { 
      name_brandId: {
        name: 'Fortuner',
        brandId: toyota.id
      }
    },
    update: {},
    create: {
      name: 'Fortuner',
      brandId: toyota.id,
    },
  });

  // Create models for Honda
  const city = await prisma.model.upsert({
    where: { 
      name_brandId: {
        name: 'City',
        brandId: honda.id
      }
    },
    update: {},
    create: {
      name: 'City',
      brandId: honda.id,
    },
  });

  const amaze = await prisma.model.upsert({
    where: { 
      name_brandId: {
        name: 'Amaze',
        brandId: honda.id
      }
    },
    update: {},
    create: {
      name: 'Amaze',
      brandId: honda.id,
    },
  });

  // Create models for Maruti
  const swift = await prisma.model.upsert({
    where: { 
      name_brandId: {
        name: 'Swift',
        brandId: maruti.id
      }
    },
    update: {},
    create: {
      name: 'Swift',
      brandId: maruti.id,
    },
  });

  const dzire = await prisma.model.upsert({
    where: { 
      name_brandId: {
        name: 'Dzire',
        brandId: maruti.id
      }
    },
    update: {},
    create: {
      name: 'Dzire',
      brandId: maruti.id,
    },
  });

  // Create models for Xerox
  const wc7525 = await prisma.model.upsert({
    where: { 
      name_brandId: {
        name: 'WC7525',
        brandId: xerox.id
      }
    },
    update: {},
    create: {
      name: 'WC7525',
      brandId: xerox.id,
    },
  });

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 