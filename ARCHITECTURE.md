# Prisma + PostgreSQL Architecture Guide

Complete technical overview of how Prisma and PostgreSQL integrate with your health assessment application.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER (Client)                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Components                                        │   │
│  │  ├─ BasicInfoForm                                        │   │
│  │  ├─ ClinicalAssessmentForm                               │   │
│  │  ├─ LifestyleForm                                        │   │
│  │  ├─ BiochemicalsForm                                     │   │
│  │  ├─ IDRSForm                                             │   │
│  │  └─ SummaryDashboard                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│               ↓                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  fetch() / API Client                                   │   │
│  │  (No logic changes - just endpoints)                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                         ↓ HTTP Requests
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER (App Router)                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API Routes (/app/api/)                                 │   │
│  │  ├─ POST /api/assessments                                │   │
│  │  ├─ GET /api/assessments                                 │   │
│  │  ├─ POST /api/assessments/draft                          │   │
│  │  ├─ GET /api/assessments/draft                           │   │
│  │  └─ DELETE /api/assessments/draft                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│               ↓                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Storage Layer (/lib/db-storage.ts)                      │   │
│  │  ├─ saveAssessmentData()                                 │   │
│  │  ├─ loadAssessmentData()                                 │   │
│  │  ├─ submitAssessment()                                   │   │
│  │  ├─ loadSubmittedAssessments()                           │   │
│  │  ├─ getEmployeeAssessments()                             │   │
│  │  └─ loadMasterCSVData()                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│               ↓                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Prisma Client (/lib/prisma.ts)                          │   │
│  │  ├─ prisma.user.findMany()                               │   │
│  │  ├─ prisma.draftAssessment.upsert()                      │   │
│  │  ├─ prisma.assessment.create()                           │   │
│  │  └─ prisma.assessment.findMany()                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                         ↓ TCP/IP Connection
┌─────────────────────────────────────────────────────────────────┐
│              PostgreSQL Database Server                          │
│              (Port 5432 by default)                              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Tables (via Prisma Schema)                             │   │
│  │  ├─ users (id, email, password, name, role, ...)        │   │
│  │  ├─ draft_assessments (userId, basicInfo, ...)          │   │
│  │  └─ assessments (id, userId, employeeId, status, ...)   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ├─ Persistent data on disk                                     │
│  ├─ ACID transactions                                           │
│  ├─ Multi-user concurrent access                               │
│  └─ Full backup/restore capabilities                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### Example 1: Saving a Draft Assessment

```
User fills form in BasicInfoForm
         ↓
handleSave() called
         ↓
fetch('/api/assessments/draft', {
  method: 'POST',
  body: { userId, assessment }
})
         ↓
Next.js receives POST at /app/api/assessments/draft/route.ts
         ↓
await saveAssessmentData(userId, assessment)  ← from /lib/db-storage.ts
         ↓
prisma.draftAssessment.upsert({...})  ← from /lib/prisma.ts
         ↓
PostgreSQL receives query:
  INSERT INTO draft_assessments (userId, basicInfo, ...)
  VALUES ('user123', '{"age": 45, ...}', ...)
         ↓
Response sent back to browser: { id, userId, updatedAt, ... }
         ↓
Component state updated with success
```

### Example 2: Loading a Draft on Page Load

```
Component mounts
         ↓
useEffect(() => { loadData() }, [user])
         ↓
await loadAssessmentData(user.id)
         ↓
fetch('/api/assessments/draft?userId=user123')
         ↓
Next.js receives GET at /app/api/assessments/draft/route.ts
         ↓
prisma.draftAssessment.findUnique({ where: { userId } })
         ↓
PostgreSQL executes SELECT query on draft_assessments table
         ↓
Returns: { id, userId, basicInfo: {...}, updatedAt, ... }
         ↓
Component state updated with loaded data
         ↓
Form displays previous draft data
```

### Example 3: Submitting an Assessment

```
User clicks "Submit Assessment" button
         ↓
submitAssessment(userId, employeeId, employeeName, data)
         ↓
fetch('/api/assessments', {
  method: 'POST',
  body: { userId, employeeId, employeeName, assessment }
})
         ↓
Next.js receives POST at /app/api/assessments/route.ts
         ↓
prisma.assessment.create({
  data: {
    userId,
    employeeId,
    basicInfo: {...},
    status: 'submitted',
    submittedAt: now()
  }
})
         ↓
PostgreSQL:
  1. INSERT into assessments table
  2. GET new assessment ID
         ↓
prisma.draftAssessment.deleteMany({ where: { userId } })
         ↓
PostgreSQL: DELETE from draft_assessments
         ↓
Return new assessment ID to browser
         ↓
Component redirects to success page
```

---

## File Structure & Responsibilities

```
project-root/
│
├── prisma/
│   ├── schema.prisma           ← YOUR DATA MODELS (3 tables defined)
│   └── migrations/
│       └── 20240101_init/      ← Auto-generated SQL migrations
│
├── lib/
│   ├── prisma.ts               ← Prisma Client singleton (DO NOT MODIFY)
│   ├── db-storage.ts           ← Storage functions (replaces old storage.ts)
│   └── storage.ts              ← OLD: localStorage (keep for reference)
│
├── app/api/assessments/
│   ├── route.ts                ← POST/GET endpoints for assessments
│   └── draft/
│       └── route.ts            ← POST/GET/DELETE draft endpoints
│
├── app/
│   ├── layout.tsx              ← NO CHANGES
│   ├── page.tsx                ← NO CHANGES
│   ├── login/page.tsx          ← NO CHANGES
│   └── dashboard/
│       ├── page.tsx            ← UPDATE: use db functions
│       ├── admin/page.tsx      ← UPDATE: use db functions
│       └── employee/page.tsx   ← UPDATE: use db functions
│
├── components/
│   ├── forms/
│   │   ├── basic-info-form.tsx      ← UPDATE: use db-storage
│   │   ├── clinical-assessment-form.tsx ← UPDATE: use db-storage
│   │   ├── lifestyle-form.tsx       ← UPDATE: use db-storage
│   │   ├── biochemicals-form.tsx    ← UPDATE: use db-storage
│   │   └── idrs-form.tsx            ← UPDATE: use db-storage
│   ├── summary-dashboard.tsx        ← UPDATE: use db-storage
│   └── (other components)           ← NO CHANGES
│
├── hooks/
│   ├── use-auth.tsx            ← NO CHANGES (provides user.id)
│   └── (others)                ← NO CHANGES
│
├── .env.local                  ← DATABASE_URL (NEVER commit)
├── .env.example                ← Template for .env.local
│
└── Documentation files
    ├── QUICK_START.md          ← 5-min setup guide
    ├── PRISMA_SETUP.md         ← Detailed setup for all platforms
    ├── INTEGRATION_CHECKLIST.md ← Component update checklist
    └── COMPONENT_UPDATE_EXAMPLE.md ← Example code updates
```

---

## Data Models (Prisma Schema)

### Users Table

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String
  name          String
  role          String   @db.VarChar(20)  // 'employee' | 'admin'
  employeeId    String?  @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  assessments   Assessment[]        // All submitted assessments
  draftData     DraftAssessment?    // Current draft (0 or 1)

  @@map("users")
}
```

**Relations:**
- 1 User → Many Assessments (submitted)
- 1 User → 1 DraftAssessment (current draft)

### Draft Assessments Table

```prisma
model DraftAssessment {
  id                  String   @id @default(cuid())
  userId              String   @unique              // Links to User
  user                User     @relation(...)
  
  basicInfo           Json?                         // Flexible structure
  clinicalAssessment  Json?                         // Flexible structure
  lifestyle           Json?                         // Flexible structure
  biochemical         Json?                         // Flexible structure
  idrs                Json?                         // Flexible structure
  timestamp           DateTime?
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([userId])                                 // Fast lookups
  @@map("draft_assessments")
}
```

**Purpose:** Store work-in-progress assessments (auto-save feature)

**Why JSON fields?**
- Your assessment data has deeply nested structures
- PostgreSQL's JSON type perfectly fits this pattern
- Flexible: fields can be added/removed without migrations
- Type-safe: Prisma still enforces TypeScript types on the client

### Assessments Table (Submitted)

```prisma
model Assessment {
  id                  String   @id @default(cuid())
  employeeId          String                        // The employee being assessed
  employeeName        String
  userId              String                        // Who submitted it
  user                User     @relation(...)
  
  basicInfo           Json                          // Immutable after submission
  clinicalAssessment  Json
  lifestyle           Json
  biochemical         Json
  idrs                Json
  
  status              String   @db.VarChar(20)      // 'submitted' | 'draft'
  submittedAt         DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@index([userId])                                 // Fast lookups by user
  @@index([employeeId])                             // Fast lookups by employee
  @@index([submittedAt])                            // Fast sorting/filtering
  @@map("assessments")
}
```

**Purpose:** Store submitted assessments (permanent records)

**Indexes:** Optimize common queries:
- `find all assessments for a user`
- `find all assessments for an employee`
- `sort assessments by submission date`

---

## API Endpoints Reference

### Assessments (Submitted)

#### POST /api/assessments
Submit a new assessment (moves from draft to submitted)

**Request:**
```json
{
  "userId": "user123",
  "employeeId": "emp456",
  "employeeName": "John Doe",
  "assessment": {
    "basicInfo": {...},
    "clinicalAssessment": {...},
    "lifestyle": {...},
    "biochemical": {...},
    "idrs": {...}
  }
}
```

**Response:**
```json
{
  "id": "ass789",
  "userId": "user123",
  "employeeId": "emp456",
  "status": "submitted",
  "submittedAt": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### GET /api/assessments
Fetch assessments

**Query Parameters:**
- `userId=user123` → Get all assessments for this user
- `employeeId=emp456` → Get all assessments for this employee
- `all=true` → Get all assessments (admin)

**Response:**
```json
[
  {
    "id": "ass789",
    "employeeId": "emp456",
    "employeeName": "John Doe",
    "status": "submitted",
    "submittedAt": "2024-01-15T10:30:00Z"
  }
]
```

### Draft Assessments

#### GET /api/assessments/draft
Fetch draft for a user

**Query Parameters:**
- `userId=user123` (required)

**Response:**
```json
{
  "id": "draft123",
  "userId": "user123",
  "basicInfo": {...},
  "clinicalAssessment": {...},
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

#### POST /api/assessments/draft
Save or update draft

**Request:**
```json
{
  "userId": "user123",
  "assessment": {
    "basicInfo": {...},
    "clinicalAssessment": {...},
    "lifestyle": {...},
    "biochemical": {...},
    "idrs": {...}
  }
}
```

**Response:** Same as request

#### DELETE /api/assessments/draft
Clear draft

**Query Parameters:**
- `userId=user123` (required)

**Response:**
```json
{
  "success": true
}
```

---

## Database Connection

### Connection String Format

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

**Examples:**

Local Docker:
```
postgresql://postgres:postgres@localhost:5432/health_assessment
```

Local direct installation:
```
postgresql://localhost:5432/health_assessment
```

Production VPS:
```
postgresql://app_user:strong_password@vps.example.com:5432/health_assessment
```

### Connection Pooling

Prisma Client automatically handles connection pooling:
- Up to 10 concurrent connections (default)
- Reuses connections for efficiency
- Automatically closes idle connections

**Configuration** (in `lib/prisma.ts`):
```typescript
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],  // Log all queries in dev
})
```

---

## Security Considerations

### 1. SQL Injection Prevention
✅ **Automatic** - Prisma uses parameterized queries
```typescript
// Safe: even if userId contains SQL, it's treated as a value
prisma.assessment.findMany({
  where: { userId: unsafeUserInput }  // ← No SQL injection possible
})
```

### 2. Password Storage
⚠️ **Manual** - Your auth layer needs this:
```typescript
import bcrypt from 'bcrypt'

// When registering
const hashedPassword = await bcrypt.hash(password, 10)
await prisma.user.create({
  data: {
    email,
    password: hashedPassword,  // ← Never store plain passwords
  }
})

// When logging in
const isValid = await bcrypt.compare(password, user.password)
```

### 3. API Authentication
⚠️ **Manual** - Add to API routes:
```typescript
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId')
  
  // Verify user is authenticated
  const user = await getAuthenticatedUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Verify userId matches authenticated user
  if (userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  // Safe to proceed
  const assessments = await prisma.assessment.findMany({
    where: { userId }
  })
  return NextResponse.json(assessments)
}
```

### 4. Environment Variables
✅ **Configured** - Use `.env.local`:
```
DATABASE_URL="postgresql://..."  ← Never commit this
```

Ensure `.gitignore` includes:
```
.env.local
.env.*.local
```

---

## Performance Optimization

### Indexes (Already Defined)

Your schema includes indexes on common queries:
```prisma
@@index([userId])      // Find assessments by user
@@index([employeeId])  // Find assessments by employee
@@index([submittedAt]) // Sort by date
```

**Result:** Queries on these fields are ~100x faster as database grows

### Query Examples

```typescript
// Fast: Indexed query
const assessments = await prisma.assessment.findMany({
  where: { userId: 'user123' }  // ← Uses index
})

// Slow: Unindexed query (avoid)
const assessments = await prisma.assessment.findMany({
  where: { basicInfo: { path: ['age'], equals: 45 } }  // ← Searches JSON
})
```

---

## Migration Strategy

### Version Control

All migrations are stored in `/prisma/migrations/`:
```
migrations/
├── 20240101000001_init/
│   ├── migration.sql
│   └── migration_lock.toml
├── 20240115000002_add_timestamps/
│   └── migration.sql
└── ...
```

**Benefits:**
- Replay migrations on new machines
- Track schema changes over time
- Rollback if needed
- Same result on dev/staging/production

### Deploying to Production

```bash
# On production server
npx prisma migrate deploy

# Applies all unapplied migrations in order
# Safe: idempotent (won't fail if already applied)
```

---

## Backup & Disaster Recovery

### Daily Backups

```bash
# Backup entire database
pg_dump -U postgres health_assessment > backup_$(date +%Y%m%d).sql

# Compress for storage
gzip backup_*.sql
```

### Point-in-Time Recovery

```bash
# Restore from backup
psql -U postgres health_assessment < backup_20240115.sql

# Database is now restored to that point in time
```

### Automated Backup (Production)

Use cron job:
```bash
# Edit crontab
crontab -e

# Add:
0 2 * * * pg_dump -U postgres health_assessment | gzip > /backups/backup_$(date +\%Y\%m\%d).sql.gz

# Backs up daily at 2 AM
```

---

## Troubleshooting Guide

### Issue: "PrismaClientInitializationError"

**Cause:** Can't connect to database

**Debug:**
```bash
# Check if database is running
psql -U postgres -d health_assessment -c "SELECT 1;"

# Check DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL
```

### Issue: "Relation does not exist"

**Cause:** Tables don't exist

**Debug:**
```bash
# Check if migrations ran
npx prisma migrate status

# Run migrations
npx prisma migrate deploy
```

### Issue: Slow queries

**Debug:**
```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: ['query']  // ← Logs all queries
})

// Check execution time in console
// Look for queries without indexes
```

---

## Next Steps

1. **Set up database** → Follow `QUICK_START.md`
2. **Update components** → Follow `INTEGRATION_CHECKLIST.md`
3. **Test** → Verify data persists to PostgreSQL
4. **Deploy** → See `PRISMA_SETUP.md` → Production Deployment
5. **Monitor** → Track database performance and backups

Your architecture is now production-ready!
