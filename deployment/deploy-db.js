// deploy-db.js - Script to deploy database migrations on production
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting database deployment...');

// Check if .env file exists, if not create a basic one
if (!fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('Creating .env file...');
  fs.writeFileSync(
    path.join(__dirname, '.env'),
    'DATABASE_URL="file:./prisma/prod.db"\n'
  );
  console.log('.env file created with default SQLite configuration');
}

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: __dirname
  });

  // Deploy migrations
  console.log('Deploying database migrations...');
  execSync('npx prisma migrate deploy', { 
    stdio: 'inherit',
    cwd: __dirname
  });

  // Run seed script if specified
  if (process.argv.includes('--seed')) {
    console.log('Running database seed...');
    
    // Copy seed.js if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'prisma', 'seed.js'))) {
      if (fs.existsSync(path.join(__dirname, '..', 'prisma', 'seed.js'))) {
        fs.copyFileSync(
          path.join(__dirname, '..', 'prisma', 'seed.js'),
          path.join(__dirname, 'prisma', 'seed.js')
        );
      } else {
        console.warn('Warning: seed.js file not found, skipping seed operation');
        process.exit(0);
      }
    }
    
    // Run the seed script
    execSync('node prisma/seed.js', { 
      stdio: 'inherit',
      cwd: __dirname
    });
  }

  console.log('✅ Database deployment completed successfully!');
} catch (error) {
  console.error('Error deploying database:', error);
  process.exit(1);
} 