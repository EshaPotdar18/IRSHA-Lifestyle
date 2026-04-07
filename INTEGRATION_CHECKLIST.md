# Prisma + PostgreSQL Integration Checklist

## Phase 1: Database Setup (Complete this first)

- [ ] **Install PostgreSQL**
  - [ ] Option A: Docker - run `docker-compose up -d`
  - [ ] Option B: Direct installation (macOS/Linux/Windows)
  - [ ] Verify: `psql -U postgres -d health_assessment -c "SELECT 1;"`

- [ ] **Configure Environment**
  - [ ] Copy `.env.example` to `.env.local`
  - [ ] Set `DATABASE_URL` for your setup
  - [ ] Test: `npx prisma db push --skip-generate`

- [ ] **Run Database Migrations**
  - [ ] `npx prisma generate`
  - [ ] `npx prisma migrate dev --name init`
  - [ ] Verify: `npx prisma studio` (should show User, Assessment, DraftAssessment tables)

---

## Phase 2: API Layer (Create server endpoints)

- [ ] **API Routes Created**
  - [ ] `/app/api/assessments/route.ts` - Main assessment endpoints
  - [ ] `/app/api/assessments/draft/route.ts` - Draft assessment endpoints
  - [ ] Both files are in place and can handle POST, GET, DELETE

- [ ] **Test API Routes**
  - [ ] Start dev server: `npm run dev`
  - [ ] Test POST /api/assessments/draft - save draft assessment
  - [ ] Test GET /api/assessments/draft - retrieve draft
  - [ ] Test POST /api/assessments - submit assessment
  - [ ] Test GET /api/assessments - retrieve submitted assessments

---

## Phase 3: Update Components (NO UI CHANGES - only data flow)

For each component that currently uses `localStorage`, update the data flow:

### Example: BasicInfoForm Component

**OLD CODE (localStorage):**
```typescript
import { saveAssessmentData, loadAssessmentData } from '@/lib/storage'

export function BasicInfoForm() {
  useEffect(() => {
    const data = loadAssessmentData()
    // ...
  }, [])

  const handleSave = () => {
    saveAssessmentData(data)
  }
}
```

**NEW CODE (database):**
```typescript
import { saveAssessmentData, loadAssessmentData } from '@/lib/db-storage'
import { useAuth } from '@/hooks/use-auth'

export function BasicInfoForm() {
  const { user } = useAuth()

  useEffect(() => {
    const loadData = async () => {
      const data = await loadAssessmentData(user.id)
      // ...
    }
    if (user) loadData()
  }, [user])

  const handleSave = async () => {
    await saveAssessmentData(user.id, data)
  }
}
```

**KEY CHANGES:**
- Import from `/lib/db-storage` instead of `/lib/storage`
- Pass `user.id` to all database functions
- Use `await` for async database calls
- No changes to JSX/UI/styling

### Components to Update

- [ ] **Dashboard Components** (`/app/dashboard/page.tsx`)
  - [ ] Replace localStorage with database calls
  - [ ] Use `loadSubmittedAssessments(userId)`
  - [ ] Use `loadMasterCSVData()` for admin view

- [ ] **Form Components** (`/components/forms/*`)
  - [ ] `BasicInfoForm.tsx` - save/load draft
  - [ ] `ClinicalAssessmentForm.tsx` - save/load draft
  - [ ] `LifestyleForm.tsx` - save/load draft
  - [ ] `BiochemicalsForm.tsx` - save/load draft
  - [ ] `IDRSForm.tsx` - save/load draft

- [ ] **Summary Dashboard** (`/components/summary-dashboard.tsx`)
  - [ ] Replace `loadSubmittedAssessments()` with database query
  - [ ] Update to use `userId` parameter

---

## Phase 4: Test Complete Data Flow

- [ ] **Smoke Tests**
  - [ ] User can log in
  - [ ] User can fill out form and save draft
  - [ ] User can close browser and draft persists in database
  - [ ] User can reopen and see draft data
  - [ ] User can submit assessment
  - [ ] Submitted assessment appears in history

- [ ] **Admin Features**
  - [ ] Admin can view all assessments
  - [ ] Admin can export CSV
  - [ ] CSV contains flattened assessment data

- [ ] **Data Validation**
  - [ ] Open `npx prisma studio`
  - [ ] Verify:
    - [ ] Users table has records with correct fields
    - [ ] DraftAssessment table has draft data
    - [ ] Assessment table has submitted assessments with timestamps

---

## Phase 5: Production Preparation

- [ ] **Security Checklist**
  - [ ] Passwords are hashed (use bcrypt in auth)
  - [ ] DATABASE_URL is NOT in version control
  - [ ] .env.local is in .gitignore
  - [ ] API routes validate user ownership (userId matches)

- [ ] **Version Control**
  - [ ] `/prisma/migrations/` is committed to Git
  - [ ] `.env.local` is NOT committed
  - [ ] `/lib/db-storage.ts` and `/lib/prisma.ts` are committed

- [ ] **Documentation**
  - [ ] PRISMA_SETUP.md is complete
  - [ ] Team knows where DATABASE_URL is stored
  - [ ] Backup procedure is documented
  - [ ] Migration steps for new developers documented

---

## Phase 6: Deployment

- [ ] **Staging Environment**
  - [ ] PostgreSQL installed on staging server
  - [ ] DATABASE_URL configured
  - [ ] Migrations run: `npx prisma migrate deploy`
  - [ ] App deployed and tested

- [ ] **Production Environment**
  - [ ] PostgreSQL installed on production server
  - [ ] Strong passwords configured
  - [ ] Backups scheduled
  - [ ] DATABASE_URL configured securely
  - [ ] Migrations run: `npx prisma migrate deploy`
  - [ ] App deployed and tested

- [ ] **Monitoring**
  - [ ] Database connections are pooled
  - [ ] Query performance is acceptable
  - [ ] Backups are running daily
  - [ ] Alerts set up for disk space/failures

---

## Rollback Plan (If Needed)

If you need to revert to localStorage temporarily:

1. **Keep both systems running in parallel:**
   - Create `/lib/storage-hybrid.ts` that reads/writes to both
   - Gradually migrate component by component

2. **Revert a specific component:**
   - Import from `/lib/storage` instead of `/lib/db-storage`
   - No other changes needed (same API)

3. **Full rollback:**
   - Database changes are non-destructive
   - Just switch imports back to `/lib/storage`
   - Data already in database remains safe

---

## Support & Troubleshooting

### "Cannot POST to /api/assessments/draft"
- Verify API route file exists at `/app/api/assessments/draft/route.ts`
- Check console for errors: `npm run dev`
- Ensure DATABASE_URL is set in `.env.local`

### "Prisma Client not found"
- Run: `npx prisma generate`
- Restart dev server: `npm run dev`

### "Database connection failed"
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Test: `psql -U postgres -d health_assessment -c "SELECT 1;"`

### "Migration already exists"
- This is fine, migrations are idempotent
- Run: `npx prisma migrate deploy`

---

## Next Phase: Advanced Features

Once Phase 1-6 are complete, consider:
- [ ] Real authentication with password hashing (bcrypt)
- [ ] API authentication tokens (JWT or sessions)
- [ ] Row-level security in PostgreSQL
- [ ] Database query optimization & indexes
- [ ] Analytics and reporting queries
- [ ] Automated backups and disaster recovery
