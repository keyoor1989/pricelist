# Deployment Guide for PriceList Application

## Admin Panel Deployment (Next.js)

### 1. Prepare your project for deployment

```bash
# Navigate to admin panel directory
cd admin-panel

# Install dependencies
npm install

# Build the application
npm run build
```

### 2. Files to upload to your shared hosting

Upload these files and directories to your shared hosting environment:

- `.next/` directory (contains the compiled application)
- `public/` directory (static assets)
- `prisma/` directory (database schema and migrations)
- `package.json` and `package-lock.json` (dependency information)
- `server.js` (custom server for shared hosting)
- `.env.production` (rename to `.env` after uploading)
- `next.config.js` (Next.js configuration)

### 3. Set up the shared hosting environment

#### cPanel Instructions:
1. Log in to your cPanel account
2. Navigate to "Setup Node.js App"
3. Create a new application:
   - Application mode: Production
   - Application root: `/path/to/your/app` (directory where you uploaded files)
   - Application URL: `https://yourdomain.com` (or your chosen path)
   - Application startup file: `server.js`
4. Configure environment variables in the Node.js app settings:
   - DATABASE_URL: path to your database
   - NODE_ENV: production
5. Click "Create" to set up the application

#### Plesk Instructions:
1. Log in to your Plesk control panel
2. Navigate to your domain
3. Go to "Node.js" under the "Hosting Services" section
4. Click "Enable Node.js"
5. Add a new application:
   - Document root: `/path/to/your/app`
   - Application startup file: `server.js`
   - Application mode: Production
6. Configure environment variables similar to cPanel
7. Click "OK" to save the configuration

### 4. Install dependencies on the server

Connect to your server via SSH or use the hosting provider's terminal and run:

```bash
cd /path/to/your/app
npm install --production
```

### 5. Database setup

If using SQLite:
1. Ensure the directory for the database file is writable
2. Run migrations: `npx prisma migrate deploy`
3. Seed the database: `npm run seed`

If using MySQL:
1. Create a MySQL database via your hosting control panel
2. Update DATABASE_URL in your .env file
3. Run migrations: `npx prisma migrate deploy`
4. Seed the database: `npm run seed`

### 6. Start the application

Using the hosting control panel, start your Node.js application.

## Mobile App Updates for Production

### 1. Update the API URL in your mobile app

Edit the `context/AuthContext.js` file and update the API_URL:

```javascript
// Change from local development URL to production
const API_URL = 'https://yourdomain.com/api';
// Remove the commented out development URLs
```

### 2. Build the mobile app for distribution

```bash
# Navigate to the mobile app directory
cd /path/to/mobile/app

# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

### 3. Distribute the mobile app

- Android: Upload the generated APK/AAB to Google Play Store
- iOS: Submit the build to Apple App Store
- Alternative: Use Expo's EAS services for distribution

## Troubleshooting

### Common issues:

1. **Database connection failures**
   - Check your DATABASE_URL in the .env file
   - Ensure database user has correct permissions
   - Verify database server is accessible from your hosting

2. **Node.js version compatibility**
   - Ensure your hosting supports Node.js 14+ (recommended for Next.js)
   - Check package.json for any Node.js engine constraints

3. **File permissions**
   - Ensure the application has write permissions to necessary directories
   - SQLite database file needs write permissions

4. **API connection from mobile app**
   - Verify SSL/HTTPS is properly set up on your domain
   - Check CORS settings in your Next.js API routes

### Getting support:

- Check hosting provider's documentation for Node.js applications
- Contact hosting support for specific configuration requirements
- Refer to Next.js documentation for deployment issues

## Regular Maintenance

1. Keep your dependencies up to date
2. Monitor server logs for errors
3. Regularly backup your database
4. Test your application after hosting provider updates 