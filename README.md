# PriceList Application

A comprehensive solution for managing and displaying product pricing information with role-based access control.

## Project Structure

The PriceList application consists of two main components:

1. **Admin Panel** - A Next.js web application for managing products, users, and other data
2. **Mobile App** - An Expo/React Native application for viewing product information

## Admin Panel

The admin panel provides a complete backend management system with CRUD functionality for:

- Products
- Brands
- Models
- Categories
- Users

### Tech Stack

- **Framework:** Next.js
- **Database:** Prisma ORM with SQLite (configurable for MySQL)
- **Authentication:** Custom authentication with bcrypt password hashing

### Features

- Comprehensive user management with role-based access (admin, dealer, enduser)
- Complete product catalog management
- CSV import/export functionality
- Responsive dashboard interface

## Mobile App

The mobile app allows users to browse and filter product information based on their access level.

### Tech Stack

- **Framework:** React Native with Expo
- **State Management:** Context API
- **Storage:** AsyncStorage for authentication persistence

### Features

- Two-screen workflow: filtering screen followed by product listing
- Filter products by brand, model, and category
- Role-based pricing display (different prices shown based on user role)
- Sharing functionality for product details
- Secure authentication with token persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (for mobile app development)

### Admin Panel Setup

```bash
# Navigate to admin panel directory
cd admin-panel

# Install dependencies
npm install

# Set up the database
npx prisma migrate dev
npm run seed

# Start the development server
npm run dev
```

The admin panel will be available at http://localhost:3000

### Mobile App Setup

```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start the development server
npm start
```

Use the Expo Go app on your device to scan the QR code, or run on an emulator.

## Default Admin Credentials

- **Email:** copierbazar@gmail.com
- **Password:** Keyoor@45080

## Deployment

### Admin Panel Deployment

The admin panel can be deployed to shared hosting environments. See the detailed deployment guide in the `admin-panel/deploy-guide.md` file.

Quick steps:
1. Build the application with `npm run build`
2. Use the prepare-deploy script: `node scripts/prepare-deploy.js`
3. Upload the generated files to your shared hosting
4. Configure the environment as specified in the deploy guide

### Mobile App Deployment

1. Update the API URL in `context/AuthContext.js` to point to your production server
2. Build for distribution using Expo's build services
3. Publish to app stores or distribute via other channels

## License

[Include your license information here]

## Contact

[Your contact information or project maintainer details] 