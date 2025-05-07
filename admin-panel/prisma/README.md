# Prisma Database Setup

This document explains how to set up and manage your MySQL database with Prisma for the Price List Admin Panel.

## Setup Instructions

1. Make sure you have MySQL installed and running on your system.
2. Create a new database named `pricelistdb`:
   ```sql
   CREATE DATABASE pricelistdb;
   ```
3. Update the `.env` file with your MySQL credentials:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/pricelistdb"
   ```
   Replace `username` and `password` with your MySQL credentials.

## Database Migration Commands

### Generate a migration
After updating your schema.prisma file, create and apply a migration:
```bash
npx prisma migrate dev --name init
```

This command will:
- Generate SQL migration files
- Apply the migration to your database
- Generate the Prisma Client

### Apply existing migrations in production
To apply existing migrations in production:
```bash
npx prisma migrate deploy
```

### Reset your database
If you need to reset your database (this will delete all data!):
```bash
npx prisma migrate reset
```

### Generate Prisma Client
If you need to regenerate Prisma Client without migrating:
```bash
npx prisma generate
```

### View your database
To open Prisma Studio (a visual database explorer):
```bash
npx prisma studio
```

## Database Structure

The database consists of the following tables:
- Brand (with logo)
- Model (linked to Brand)
- Category
- Product (linked to Brand, Model, and Category)
- User (with role management)

All necessary relationships are defined in the schema.prisma file. 