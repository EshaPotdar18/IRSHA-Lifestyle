# Prisma + PostgreSQL Setup Guide

This document provides step-by-step instructions to integrate PostgreSQL and Prisma into your health assessment application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [PostgreSQL Installation](#postgresql-installation)
3. [Prisma Setup](#prisma-setup)
4. [Database Migration](#database-migration)
5. [Testing the Setup](#testing-the-setup)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:
- Node.js 16+ installed
- npm or pnpm installed
- PostgreSQL 12+ (or Docker)
- A terminal/command line interface

---

## PostgreSQL Installation

### Option 1: Docker (Recommended for Local Development)

**Step 1:** Create a `docker-compose.yml` in your project root:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: health_assessment_db
    environment:
      POSTGRES_DB: health_assessment
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Step 2:** Start PostgreSQL:

```bash
docker-compose up -d
```

**Step 3:** Verify it's running:

```bash
docker ps | grep postgres
```

You should see the `health_assessment_db` container running.

---

### Option 2: Direct Installation

#### macOS (using Homebrew):

```bash
# Install PostgreSQL
brew install postgresql@15

# Start the service
brew services start postgresql@15

# Create the database
createdb health_assessment

# Verify installation
psql -U postgres -d health_assessment -c "SELECT version();"
```

#### Linux (Ubuntu/Debian):

```bash
# Update package manager
sudo apt-get update

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Start the service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database as postgres user
sudo -u postgres createdb health_assessment

# Verify
sudo -u postgres psql -d health_assessment -c "SELECT version();"
```

#### Windows:

1. Download PostgreSQL installer: https://www.postgresql.org/download/windows/
2. Run the installer and follow on-screen instructions
3. When prompted, set the password for the `postgres` user (remember this!)
4. During installation, select "Stack Builder" to install pgAdmin (GUI tool for management)
5. After installation, open pgAdmin and create a new database named `health_assessment`

---

## Prisma Setup

### Step 1: Install Dependencies

Your `package.json` already has these, but verify they're installed:

```bash
npm install @prisma/client prisma
npm install -D prisma
```

### Step 2: Configure Environment Variables

**Create `.env.local` in your project root:**

```bash
cp .env.example .env.local
```

**Edit `.env.local` and set your DATABASE_URL:**

For Docker:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/health_assessment"
```

For Direct Installation on macOS/Linux:
```
DATABASE_URL="postgresql://localhost:5432/health_assessment"
```

For Direct Installation on Windows:
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/health_assessment"
```

### Step 3: Verify Connection

Test your connection string:

```bash
npx prisma db push --skip-generate
```

If successful, you'll see: `✓ Pushed to database`

---

## Database Migration

### Step 1: Generate Prisma Client

```bash
npx prisma generate
```

This creates the Prisma Client based on your schema.

### Step 2: Create Initial Migration

```bash
npx prisma migrate dev --name init
```

This:
- Creates all tables in PostgreSQL
- Generates migration files in `prisma/migrations/`
- Commits the migration for version control

**Important:** Commit the `prisma/migrations/` folder to Git. This makes it easy to replay migrations on other machines.

### Step 3: Verify Schema

```bash
npx prisma studio
```

This opens a web UI where you can browse your database schema and data. Press `Ctrl+C` to exit.

---

## Testing the Setup

### Step 1: Create a Test User

```bash
npx prisma studio
```

1. Click on the "User" table
2. Click "Add record"
3. Fill in:
   - email: `test@example.com`
   - password: `hashed_password_here` (in production, use bcrypt)
   - name: `Test User`
   - role: `employee`
4. Click "Save"

### Step 2: Verify API Routes

Start your Next.js development server:

```bash
npm run dev
```

Test the API endpoints:

**Save a draft:**
```bash
curl -X POST http://localhost:3000/api/assessments/draft \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_FROM_STUDIO",
    "assessment": {
      "basicInfo": {"age": 45},
      "clinicalAssessment": {},
      "lifestyle": {},
      "biochemical": {},
      "idrs": {}
    }
  }'
```

**Fetch draft:**
```bash
curl http://localhost:3000/api/assessments/draft?userId=USER_ID_FROM_STUDIO
```

You should get a JSON response with your draft data.

---

## Production Deployment

### Hosting Options

Choose one of these for long-term self-hosted setup:

#### Option A: VPS (Recommended)

Popular providers:
- **Hetzner Cloud** ($5–10/month, excellent reliability)
- **DigitalOcean** ($5–15/month, great documentation)
- **Linode** ($5–20/month, high performance)
- **Vultr** ($2.50+/month, global locations)

**Setup on VPS:**

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Install PostgreSQL
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
```

Then in PostgreSQL prompt:
```sql
CREATE DATABASE health_assessment;
CREATE USER app_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE health_assessment TO app_user;
\q
```

**Deploy your Next.js app:**

```bash
# Install Node.js on VPS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your repository
git clone your-repo-url
cd your-project

# Install dependencies
npm install

# Set environment variable
echo 'DATABASE_URL="postgresql://app_user:strong_password_here@localhost:5432/health_assessment"' >> .env.local

# Run migrations
npx prisma migrate deploy

# Build and start
npm run build
npm start
```

#### Option B: Docker Compose (Full Stack)

Create a production `docker-compose.prod.yml`:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: health_assessment_db
    environment:
      POSTGRES_DB: health_assessment
      POSTGRES_USER: app_user
      POSTGRES_PASSWORD: strong_password_here
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  app:
    build: .
    container_name: health_assessment_app
    environment:
      DATABASE_URL: "postgresql://app_user:strong_password_here@postgres:5432/health_assessment"
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    restart: always

volumes:
  postgres_data:
```

Then:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## Backing Up and Migrating Data

### Backup Your Database

```bash
# Local backup
pg_dump -U postgres health_assessment > backup.sql

# Or with Docker
docker exec health_assessment_db pg_dump -U postgres health_assessment > backup.sql
```

### Restore to New Server

```bash
# On new server, create database first
psql -U postgres -c "CREATE DATABASE health_assessment;"

# Restore backup
psql -U postgres health_assessment < backup.sql
```

### Migrating to Another Machine

1. **On old machine:**
   ```bash
   pg_dump -U postgres health_assessment > backup.sql
   # Transfer backup.sql to new machine
   ```

2. **On new machine:**
   - Install PostgreSQL and create database
   - Restore backup: `psql -U postgres health_assessment < backup.sql`
   - Update `DATABASE_URL` in `.env.local`
   - Run: `npx prisma migrate deploy`
   - Start your app

---

## Troubleshooting

### "Could not connect to database"

**Cause:** PostgreSQL is not running or DATABASE_URL is incorrect

**Solution:**
```bash
# For Docker
docker ps | grep postgres

# For direct installation on macOS
brew services list

# For Linux
sudo systemctl status postgresql

# Test connection
psql -U postgres -d health_assessment -c "SELECT 1;"
```

### "relation does not exist"

**Cause:** Migrations haven't been run

**Solution:**
```bash
npx prisma migrate deploy
```

### "password authentication failed"

**Cause:** Incorrect password in DATABASE_URL

**Solution:**
```bash
# Reset PostgreSQL password (macOS)
sudo -u postgres psql

# In postgres prompt
ALTER USER postgres WITH PASSWORD 'new_password';
\q

# Update .env.local with new password
```

### "Prisma Client not found"

**Cause:** Prisma Client hasn't been generated

**Solution:**
```bash
npx prisma generate
```

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Configure `.env.local`
3. ✅ Run `npx prisma migrate dev --name init`
4. ✅ Test with `npx prisma studio`
5. ✅ Update your components to use the API routes instead of localStorage

Your components should now call `/api/assessments/` and `/api/assessments/draft/` instead of using `localStorage` directly.

See `/lib/db-storage.ts` for the database storage layer API.
