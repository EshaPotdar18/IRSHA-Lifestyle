#!/bin/bash

# Database Setup Script for Health Assessment App
# This script helps set up PostgreSQL and Prisma for local development

set -e

echo "=========================================="
echo "Health Assessment App - Database Setup"
echo "=========================================="
echo ""

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if psql -U postgres -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✓ PostgreSQL is running"
else
    echo "✗ PostgreSQL is not running"
    echo ""
    echo "Please start PostgreSQL:"
    echo "  - macOS: brew services start postgresql@15"
    echo "  - Linux: sudo systemctl start postgresql"
    echo "  - Docker: docker-compose up -d"
    exit 1
fi

# Create database if it doesn't exist
echo ""
echo "Creating database (if not exists)..."
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'health_assessment'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE health_assessment"
echo "✓ Database 'health_assessment' is ready"

# Create .env.local if it doesn't exist
echo ""
echo "Setting up environment variables..."
if [ ! -f .env.local ]; then
    echo "DATABASE_URL=\"postgresql://postgres@localhost:5432/health_assessment\"" > .env.local
    echo "✓ Created .env.local"
else
    echo "✓ .env.local already exists"
fi

# Install dependencies
echo ""
echo "Installing Prisma dependencies..."
npm install @prisma/client prisma

# Generate Prisma Client
echo ""
echo "Generating Prisma Client..."
npx prisma generate

# Run migrations
echo ""
echo "Running database migrations..."
npx prisma migrate dev --name init

# Verify
echo ""
echo "Verifying setup..."
npx prisma db push --skip-generate

echo ""
echo "=========================================="
echo "✓ Database setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review .env.local and ensure DATABASE_URL is correct"
echo "2. Start your app: npm run dev"
echo "3. Test the API endpoints"
echo "4. View your data: npx prisma studio"
echo ""
