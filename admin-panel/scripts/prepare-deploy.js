const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Deployment preparation script
console.log('Preparing deployment package...');

// Check if the dist directory exists, if not create it
const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
  console.log('Created dist directory');
}

try {
  // Build the Next.js application
  console.log('Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // List of files and directories to copy
  const filesToCopy = [
    '.next',
    'public',
    'prisma',
    'package.json',
    'package-lock.json',
    'next.config.js',
    'server.js'
  ];
  
  // Copy files to dist directory
  console.log('Copying deployment files...');
  filesToCopy.forEach(file => {
    const source = path.join(__dirname, '..', file);
    const destination = path.join(distDir, file);
    
    if (fs.existsSync(source)) {
      if (fs.lstatSync(source).isDirectory()) {
        // Copy directory recursively
        execSync(`cp -r "${source}" "${destination}"`, { stdio: 'inherit' });
      } else {
        // Copy file
        fs.copyFileSync(source, destination);
      }
      console.log(`Copied ${file}`);
    } else {
      console.warn(`Warning: ${file} not found, skipping`);
    }
  });
  
  // Copy .env.production to dist/.env
  if (fs.existsSync(path.join(__dirname, '../.env.production'))) {
    fs.copyFileSync(
      path.join(__dirname, '../.env.production'), 
      path.join(distDir, '.env')
    );
    console.log('Copied .env.production to dist/.env');
  } else {
    console.warn('Warning: .env.production not found, environment variables will need to be set manually');
  }
  
  // Create a ZIP file for easy upload (optional)
  console.log('Creating deployment ZIP file...');
  execSync(`cd ${distDir} && zip -r ../deployment.zip .`, { stdio: 'inherit' });
  
  console.log('\n✅ Deployment package created successfully!');
  console.log('Files are in the dist/ directory');
  console.log('A ZIP file has been created at deployment.zip');
  console.log('\nUpload these files to your shared hosting provider and follow the deployment guide.');
  
} catch (error) {
  console.error('Error preparing deployment:', error);
  process.exit(1);
} 