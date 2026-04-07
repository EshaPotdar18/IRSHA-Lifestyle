# Setup Verification Checklist

Before you start, verify everything is in place. This takes 2 minutes.

## ✅ Files Created (Run This First)

Run this command to verify all new files exist:

```bash
# Linux/macOS
ls -la prisma/schema.prisma lib/prisma.ts lib/db-storage.ts app/api/assessments/route.ts app/api/assessments/draft/route.ts .env.example QUICK_START.md PRISMA_SETUP.md

# Windows PowerShell
Test-Path prisma/schema.prisma, lib/prisma.ts, lib/db-storage.ts, app/api/assessments/route.ts, app/api/assessments/draft/route.ts, .env.example, QUICK_START.md, PRISMA_SETUP.md
```

**Expected output:**
```
✓ prisma/schema.prisma - Database schema
✓ lib/prisma.ts - Prisma Client singleton
✓ lib/db-storage.ts - Storage functions
✓ app/api/assessments/route.ts - Assessment API
✓ app/api/assessments/draft/route.ts - Draft API
✓ .env.example - Environment template
✓ QUICK_START.md - Setup guide
✓ PRISMA_SETUP.md - Detailed guide
```

If any files are missing, the setup is incomplete.

## ✅ Dependencies Installed

Check if Prisma packages are in `package.json`:

```bash
grep -E "@prisma/client|prisma" package.json
```

**Expected output:**
```json
"@prisma/client": "^7.2.0",
"prisma": "^6.19.2",
```

If missing, run:
```bash
npm install @prisma/client prisma -D prisma
```

## ✅ PostgreSQL Check

### For Docker Users
```bash
docker ps | grep postgres
```

**Expected output:**
```
CONTAINER ID   IMAGE              STATUS
abc123def456   postgres:15-alpine   Up 2 hours
```

**If not running:**
```bash
docker-compose up -d
```

### For Direct Installation

**macOS:**
```bash
brew services list | grep postgresql
```

**Should show:**
```
postgresql@15 started
```

**If not started:**
```bash
brew services start postgresql@15
```

**Linux:**
```bash
sudo systemctl status postgresql
```

**Should show:**
```
● postgresql.service - PostgreSQL Database Server
   Loaded: loaded
   Active: active (running)
```

**If not started:**
```bash
sudo systemctl start postgresql
```

**Windows:**
Check pgAdmin or Services: PostgreSQL should be listed and running.

### Verify Connection

```bash
psql -U postgres -d health_assessment -c "SELECT 1;"
```

**Expected output:**
```
?column?
----------
        1
```

**If fails:**
- PostgreSQL isn't running (see above)
- Database doesn't exist (will be created by migrations)
- Wrong credentials in connection string

## ✅ Environment Variables

Check if `.env.local` exists:

```bash
ls -la .env.local
```

**Expected:**
```
.env.local  (file exists)
```

**If missing, create it:**
```bash
cp .env.example .env.local
```

**Edit `.env.local` and verify DATABASE_URL:**

```bash
cat .env.local | grep DATABASE_URL
```

**Expected:**
```
DATABASE_URL="postgresql://..."
```

### Test Connection String

If unsure about your connection string, test it:

```bash
# For the connection string in .env.local
psql "postgresql://postgres@localhost:5432/health_assessment" -c "SELECT 1;"
```

**Should return:**
```
?column?
----------
        1
```

**Common connection strings:**

Local Docker:
```
postgresql://postgres:postgres@localhost:5432/health_assessment
```

Local macOS/Linux:
```
postgresql://localhost:5432/health_assessment
```

Windows (replace PASSWORD):
```
postgresql://postgres:PASSWORD@localhost:5432/health_assessment
```

## ✅ Prisma Schema

Verify the schema is syntactically correct:

```bash
npx prisma validate
```

**Expected output:**
```
✓ Your schema is valid
```

**If fails:**
- Schema file has syntax errors
- Missing required fields
- Contact v0 for help

## ✅ Generate Prisma Client

```bash
npx prisma generate
```

**Expected output:**
```
✓ Generated Prisma Client (v7.2.0) to ./node_modules/.prisma/client in 245ms
```

**If fails:**
- Node modules not installed: `npm install`
- Schema invalid: run `npx prisma validate`

## ✅ Dry Run: Push Without Data

```bash
npx prisma db push --skip-generate
```

**Expected output:**
```
✓ Pushed to database
```

**If fails:**
- PostgreSQL not running
- DATABASE_URL incorrect
- Permission issues with database

## ✅ Create Initial Tables

```bash
npx prisma migrate dev --name init
```

**Expected output:**
```
✓ Your database is now in sync with your Prisma schema
✓ Prisma Migrate created the following database changes:
...
```

New directory should exist:
```
prisma/migrations/
└── 20240101000001_init/
    └── migration.sql
```

## ✅ Open Prisma Studio

```bash
npx prisma studio
```

**Expected:**
- Browser opens to http://localhost:5555
- Shows 3 tables: `users`, `draft_assessments`, `assessments`
- All tables are empty
- Can view schema and add test records

**If fails:**
- Prisma Studio needs to download: `npm install`
- Port 5555 in use: change with `npx prisma studio --port 5556`

## ✅ API Routes Exist

Verify Next.js can find API routes:

```bash
ls -la app/api/assessments/
```

**Expected:**
```
route.ts       (main endpoint)
draft/
  └── route.ts (draft endpoint)
```

## ✅ Test API Endpoints

Start your dev server:

```bash
npm run dev
```

In another terminal, test the API:

**Create a test user first in Prisma Studio**, then:

```bash
# Test draft endpoint
curl -X GET "http://localhost:3000/api/assessments/draft?userId=YOUR_USER_ID"
```

**Expected response:**
```json
null
```

(null because no draft yet - that's correct!)

```bash
# Save a draft
curl -X POST "http://localhost:3000/api/assessments/draft" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "assessment": {
      "basicInfo": {"age": 45},
      "clinicalAssessment": {},
      "lifestyle": {},
      "biochemical": {},
      "idrs": {}
    }
  }'
```

**Expected response:**
```json
{
  "id": "clu1234...",
  "userId": "YOUR_USER_ID",
  "basicInfo": {"age": 45},
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## ✅ Documentation Exists

Verify all guides are available:

```bash
ls -la *.md | grep -E "QUICK_START|PRISMA_SETUP|INTEGRATION|ARCHITECTURE|IMPLEMENTATION"
```

**Expected:**
```
QUICK_START.md
PRISMA_SETUP.md
INTEGRATION_CHECKLIST.md
COMPONENT_UPDATE_EXAMPLE.md
ARCHITECTURE.md
IMPLEMENTATION_SUMMARY.md
```

## ✅ Complete Setup Verification Script

Run this all-in-one script:

**macOS/Linux:**
```bash
#!/bin/bash

echo "Checking setup..."
echo ""

# Check files
echo "1. Checking files..."
for file in "prisma/schema.prisma" "lib/prisma.ts" "lib/db-storage.ts" "app/api/assessments/route.ts" ".env.local"; do
  if [ -f "$file" ]; then
    echo "   ✓ $file"
  else
    echo "   ✗ $file MISSING"
  fi
done

# Check database
echo ""
echo "2. Checking PostgreSQL..."
if psql -U postgres -c "SELECT 1;" > /dev/null 2>&1; then
  echo "   ✓ PostgreSQL is running"
else
  echo "   ✗ PostgreSQL is not running"
fi

# Check Prisma
echo ""
echo "3. Checking Prisma..."
if npx prisma validate > /dev/null 2>&1; then
  echo "   ✓ Prisma schema is valid"
else
  echo "   ✗ Prisma schema is invalid"
fi

# Check API routes
echo ""
echo "4. Starting dev server and testing API..."
timeout 5 npm run dev > /dev/null 2>&1 &
sleep 3

if curl -s "http://localhost:3000/api/assessments/draft?userId=test" > /dev/null; then
  echo "   ✓ API endpoints are working"
else
  echo "   ✗ API endpoints are not responding"
fi

kill $! 2>/dev/null || true

echo ""
echo "Setup verification complete!"
```

**Windows PowerShell:**
```powershell
Write-Host "Checking setup..." -ForegroundColor Green
Write-Host ""

# Check files
Write-Host "1. Checking files..."
$files = @(
  "prisma/schema.prisma",
  "lib/prisma.ts",
  "lib/db-storage.ts",
  "app/api/assessments/route.ts",
  ".env.local"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "   ✓ $file" -ForegroundColor Green
  } else {
    Write-Host "   ✗ $file MISSING" -ForegroundColor Red
  }
}

# Check Prisma
Write-Host ""
Write-Host "2. Checking Prisma..."
$prisma_valid = & npx prisma validate 2>&1
if ($prisma_valid -match "valid") {
  Write-Host "   ✓ Prisma schema is valid" -ForegroundColor Green
} else {
  Write-Host "   ✗ Prisma schema is invalid" -ForegroundColor Red
}

Write-Host ""
Write-Host "Setup verification complete!" -ForegroundColor Green
```

---

## Troubleshooting This Checklist

### "PostgreSQL is not running"

**macOS:**
```bash
brew services start postgresql@15
brew services list | grep postgresql  # Verify started
```

**Linux:**
```bash
sudo systemctl start postgresql
sudo systemctl status postgresql  # Verify started
```

**Docker:**
```bash
docker-compose up -d
docker ps | grep postgres  # Verify started
```

### "DATABASE_URL incorrect"

Test your connection string directly:

```bash
# Extract DATABASE_URL from .env.local
source .env.local

# Test it
psql "$DATABASE_URL" -c "SELECT 1;"
```

### "Prisma schema is invalid"

Run validation:

```bash
npx prisma validate
```

This will show exactly what's wrong.

### "Cannot connect to port 5432"

PostgreSQL might be running on a different port:

```bash
# Find PostgreSQL
sudo lsof -i :5432  # Linux/macOS
netstat -ano | findstr :5432  # Windows

# Or check PostgreSQL config
cat /etc/postgresql/*/main/postgresql.conf | grep port
```

---

## What If Everything Checks Out?

✅ You're ready! Follow `QUICK_START.md` for the final 3-step setup.

## What If Something Fails?

1. Check the error message above
2. Verify the specific troubleshooting step
3. If still stuck, check `PRISMA_SETUP.md` → Troubleshooting section
4. Or check `ARCHITECTURE.md` → Troubleshooting section

**You should not proceed to component updates until all checks pass.**
