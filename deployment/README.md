# Database Migration Deployment

This package contains all the necessary files to deploy the PriceList database schema to your production environment.

## Contents

- `prisma/schema.prisma` - The database schema definition
- `prisma/migrations/` - All migration files for creating the database
- `prisma/seed.js` - Script to populate the database with initial data
- `deploy-db.js` - Helper script to simplify deployment

## Deployment Instructions

### Option 1: Using the deployment script (Recommended)

The deployment script automates the process of applying migrations and optionally seeding the database.

1. Make sure Node.js is installed on your server (v14 or higher recommended)

2. Install required dependencies:
   ```bash
   npm install @prisma/client prisma
   ```

3. Configure your database:
   - For SQLite (default): Create a `.env` file with `DATABASE_URL="file:./prisma/prod.db"`
   - For MySQL: Create a `.env` file with `DATABASE_URL="mysql://username:password@host:port/database"`

4. Run the deployment script:
   ```bash
   # Apply migrations only
   node deploy-db.js
   
   # Apply migrations and seed the database
   node deploy-db.js --seed
   ```

### Option 2: Manual deployment using Prisma CLI

If you prefer to run commands manually:

1. Install Prisma CLI:
   ```bash
   npm install -g prisma
   ```

2. Set your database connection:
   ```bash
   # Create a .env file with your database connection string
   echo 'DATABASE_URL="file:./prisma/prod.db"' > .env
   # Or for MySQL
   # echo 'DATABASE_URL="mysql://username:password@host:port/database"' > .env
   ```

3. Deploy migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Seed the database (optional):
   ```bash
   node prisma/seed.js
   ```

## Using with MySQL on Shared Hosting

If you're using MySQL on shared hosting:

1. Create a MySQL database through your hosting control panel
2. Update your .env file with the MySQL connection string
3. If needed, modify the `prisma/schema.prisma` file to change the provider from `"sqlite"` to `"mysql"`
4. Run the migration commands as described above

## Troubleshooting

- **Permission issues**: Make sure the process has write access to the directory where the database file will be created (for SQLite)
- **Connection errors**: Verify your database credentials and connection string
- **Error with SQLite**: Ensure the directory for the SQLite database exists and is writable 