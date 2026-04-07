# Quick Start: Prisma + PostgreSQL Integration

Get your database running in 5 minutes.

## Step 1: Start PostgreSQL (Choose One)

### With Docker (Easiest)
```bash
docker-compose up -d
```

### On macOS
```bash
brew services start postgresql@15
```

### On Linux
```bash
sudo systemctl start postgresql
```

---

## Step 2: Configure Database Connection

**Create `.env.local` file in project root:**

```bash
cp .env.example .env.local
```

**Edit `.env.local` and set:**

For Docker:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/health_assessment"
```

For macOS/Linux:
```
DATABASE_URL="postgresql://localhost:5432/health_assessment"
```

---

## Step 3: Set Up Database Schema

```bash
# Install Prisma if not already done
npm install @prisma/client prisma

# Generate Prisma Client
npx prisma generate

# Create tables and run migrations
npx prisma migrate dev --name init
```

You'll see:
```
✓ Your database is now in sync with your Prisma schema
```

---

## Step 4: Verify Setup

Open Prisma Studio to see your database:

```bash
npx prisma studio
```

Browser opens at `http://localhost:5555` showing your empty database with 3 tables:
- `users`
- `draft_assessments`
- `assessments`

Press `Ctrl+C` to close.

---

## Step 5: Start Your App

```bash
npm run dev
```

Open http://localhost:3000

---

## Step 6: Test the API

Create a user and test the draft endpoint:

**In a new terminal:**

```bash
# Create a test user in Prisma Studio (or use an existing userId)
# Then test the draft API:

curl -X POST http://localhost:3000/api/assessments/draft \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "clXXXXXXXXXXXXXX",
    "assessment": {
      "basicInfo": {"age": 45, "gender": "M"},
      "clinicalAssessment": {},
      "lifestyle": {},
      "biochemical": {},
      "idrs": {}
    }
  }'
```

You should see a JSON response with your draft data saved to PostgreSQL.

---

## Next Steps

1. **Update your components** to use the database API instead of localStorage
   - See: `INTEGRATION_CHECKLIST.md` for detailed component-by-component guide
   - Import from `/lib/db-storage.ts` instead of `/lib/storage.ts`
   - Add `userId` parameter to all function calls

2. **Test data flow**
   - Save a draft assessment
   - Close the browser
   - Reopen and verify draft persists

3. **Deploy to production** when ready
   - See: `PRISMA_SETUP.md` → "Production Deployment" section

---

## Troubleshooting

### "Cannot connect to database"
```bash
# Verify PostgreSQL is running
docker ps | grep postgres  # For Docker
psql -U postgres -c "SELECT 1;"  # Direct installation

# Check .env.local has correct DATABASE_URL
cat .env.local
```

### "Migration failed"
```bash
# Reset and try again (only for development!)
npx prisma migrate reset --force

# Or manually:
dropdb health_assessment
createdb health_assessment
npx prisma migrate dev --name init
```

### "Prisma Client not found"
```bash
npx prisma generate
npm run dev  # Restart dev server
```

---

## Files Created

- ✅ `/prisma/schema.prisma` - Database schema
- ✅ `/lib/prisma.ts` - Prisma Client singleton
- ✅ `/lib/db-storage.ts` - Storage functions (replaces localStorage)
- ✅ `/app/api/assessments/route.ts` - Main API endpoint
- ✅ `/app/api/assessments/draft/route.ts` - Draft API endpoint
- ✅ `/.env.example` - Environment template
- ✅ `/PRISMA_SETUP.md` - Detailed setup guide
- ✅ `/INTEGRATION_CHECKLIST.md` - Component update checklist

---

## What's Next?

Your database layer is ready. Now update your components:

1. Replace `localStorage` calls with database API calls
2. Add `userId` parameter to all storage functions
3. Use `await` for async database operations
4. Test the complete data flow end-to-end

**No UI/UX changes needed.** Only the underlying data persistence changes from client-side storage to PostgreSQL.

For help, see:
- **Setup issues?** → `/PRISMA_SETUP.md`
- **Component updates?** → `/INTEGRATION_CHECKLIST.md`
- **API reference?** → `/lib/db-storage.ts` and `/app/api/assessments/`
