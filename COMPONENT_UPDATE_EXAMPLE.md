# Component Update Example

This document shows exactly how to update your components from localStorage to PostgreSQL.

## The Pattern

Every component that uses storage follows this pattern:

### OLD: Using localStorage

```typescript
"use client"
import { saveAssessmentData, loadAssessmentData } from '@/lib/storage'

export function MyComponent() {
  const [data, setData] = useState<AssessmentData | null>(null)

  // Load on mount
  useEffect(() => {
    const saved = loadAssessmentData()
    if (saved) setData(saved)
  }, [])

  // Save on change
  const handleSave = () => {
    saveAssessmentData(data)
    console.log("Saved to localStorage")
  }

  return (
    <div>
      <button onClick={handleSave}>Save</button>
    </div>
  )
}
```

### NEW: Using PostgreSQL

```typescript
"use client"
import { saveAssessmentData, loadAssessmentData } from '@/lib/db-storage'
import { useAuth } from '@/hooks/use-auth'

export function MyComponent() {
  const { user } = useAuth()  // ← Get user ID
  const [data, setData] = useState<AssessmentData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load on mount
  useEffect(() => {
    if (!user) return
    
    const loadData = async () => {
      setIsLoading(true)
      const saved = await loadAssessmentData(user.id)  // ← Add user.id
      if (saved) setData(saved)
      setIsLoading(false)
    }
    
    loadData()
  }, [user])

  // Save on change
  const handleSave = async () => {  // ← Make async
    if (!user) return
    
    try {
      await saveAssessmentData(user.id, data)  // ← Add user.id and await
      console.log("Saved to PostgreSQL")
    } catch (error) {
      console.error("Save failed:", error)
    }
  }

  if (!user) return <div>Loading...</div>
  if (isLoading) return <div>Loading your data...</div>

  return (
    <div>
      <button onClick={handleSave}>Save</button>
    </div>
  )
}
```

## Changes Summary

| Aspect | OLD | NEW |
|--------|-----|-----|
| Import | `@/lib/storage` | `@/lib/db-storage` |
| Functions | Synchronous | Async (use `await`) |
| Parameter | None | `userId` (first param) |
| Error handling | None | Try/catch or error state |
| Loading state | None | Add `isLoading` state |
| Conditional render | None | Check `user` exists |

---

## Real Example: BasicInfoForm

This is what an actual update looks like.

### BEFORE (localStorage)

```typescript
"use client"

import { useEffect, useState } from 'react'
import { saveAssessmentData, loadAssessmentData } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function BasicInfoForm() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
  })

  useEffect(() => {
    const data = loadAssessmentData()
    if (data?.basicInfo) {
      setFormData(data.basicInfo)
    }
  }, [])

  const handleSave = () => {
    saveAssessmentData({
      basicInfo: formData,
      clinicalAssessment: {},
      lifestyle: {},
      biochemical: {},
      idrs: {},
    })
  }

  return (
    <div>
      <Input
        value={formData.age}
        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        placeholder="Age"
      />
      <Button onClick={handleSave}>Save</Button>
    </div>
  )
}
```

### AFTER (PostgreSQL)

```typescript
"use client"

import { useEffect, useState } from 'react'
import { saveAssessmentData, loadAssessmentData } from '@/lib/db-storage'  // ← Changed
import { useAuth } from '@/hooks/use-auth'  // ← Added
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function BasicInfoForm() {
  const { user } = useAuth()  // ← Added
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
  })
  const [isSaving, setIsSaving] = useState(false)  // ← Added

  useEffect(() => {
    if (!user) return  // ← Added: wait for user
    
    const loadData = async () => {  // ← Changed to async
      const data = await loadAssessmentData(user.id)  // ← Added: await & user.id
      if (data?.basicInfo) {
        setFormData(data.basicInfo)
      }
    }
    
    loadData()
  }, [user])  // ← Changed: added user dependency

  const handleSave = async () => {  // ← Changed to async
    if (!user) return  // ← Added: check user exists
    
    setIsSaving(true)
    try {
      await saveAssessmentData(user.id, {  // ← Changed: await & add user.id
        basicInfo: formData,
        clinicalAssessment: {},
        lifestyle: {},
        biochemical: {},
        idrs: {},
      })
    } catch (error) {
      console.error('Save failed:', error)  // ← Added: error handling
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return <div>Authenticating...</div>  // ← Added

  return (
    <div>
      <Input
        value={formData.age}
        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        placeholder="Age"
        disabled={isSaving}  // ← Added
      />
      <Button onClick={handleSave} disabled={isSaving}>  {/* ← Added */}
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  )
}
```

---

## Component Checklist Template

Copy this for each component you update:

```typescript
"use client"

import { useEffect, useState } from 'react'
import { 
  saveAssessmentData, 
  loadAssessmentData,
  // ... import other functions as needed
} from '@/lib/db-storage'
import { useAuth } from '@/hooks/use-auth'

export function YourComponent() {
  const { user } = useAuth()
  const [data, setData] = useState<YourDataType>(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load data on mount
  useEffect(() => {
    if (!user) return

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const loaded = await loadAssessmentData(user.id)
        if (loaded) setData(loaded.relevantSection)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading data')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [user])

  // Save data
  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    try {
      await saveAssessmentData(user.id, {
        basicInfo: {},
        clinicalAssessment: {},
        lifestyle: {},
        biochemical: {},
        idrs: {},
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving data')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return <div>Please log in</div>
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {/* Your form JSX stays EXACTLY the same */}
      <button onClick={handleSave}>Save</button>
    </div>
  )
}
```

---

## API Migration Functions

These functions from `/lib/db-storage.ts` have the same names but different signatures:

```typescript
// OLD: synchronous
const data = loadAssessmentData()
saveAssessmentData(data)

// NEW: async with userId parameter
const data = await loadAssessmentData(userId)
await saveAssessmentData(userId, data)
```

### Complete Function Reference

```typescript
// Load draft assessment for a user
await loadAssessmentData(userId: string): Promise<AssessmentData | null>

// Save draft assessment
await saveAssessmentData(userId: string, data: AssessmentData): Promise<void>

// Submit an assessment (move to submitted)
await submitAssessment(
  userId: string,
  employeeId: string,
  employeeName: string,
  data: AssessmentData
): Promise<string>

// Load all submitted assessments for a user
await loadSubmittedAssessments(userId: string): Promise<SubmittedAssessment[]>

// Get assessments for an employee
await getEmployeeAssessments(employeeId: string): Promise<SubmittedAssessment[]>

// Clear draft
await clearAssessmentData(userId: string): Promise<void>

// Get all assessments (admin)
await loadMasterCSVData(): Promise<any[]>
```

---

## Testing Your Update

After updating a component:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open the component in browser**

3. **Test the flow:**
   - Fill in form data
   - Click Save
   - You should see "Saving..." briefly
   - Close browser tab
   - Reopen app
   - Data should still be there

4. **Verify in database:**
   ```bash
   npx prisma studio
   # Look in draft_assessments table
   ```

---

## Common Errors & Fixes

### "user is undefined"
```typescript
// ❌ Wrong: Will crash before user loads
const handleClick = () => {
  saveAssessmentData(user.id, data)  // user is null!
}

// ✅ Right: Check user exists first
const handleClick = () => {
  if (!user) return
  saveAssessmentData(user.id, data)
}
```

### "Cannot read property 'then' of undefined"
```typescript
// ❌ Wrong: Forgot to await
const result = loadAssessmentData(user.id)  // Returns Promise
console.log(result.basicInfo)  // result is still a Promise!

// ✅ Right: Use await
const result = await loadAssessmentData(user.id)  // Waits for data
console.log(result.basicInfo)  // Now it's the data
```

### "Save failed: PrismaClientInitializationError"
```
Database not running or DATABASE_URL incorrect
→ Check .env.local
→ Verify PostgreSQL is running
→ Check DATABASE_URL format
```

---

## Migration Timeline

Suggested order to update components:

1. **BasicInfoForm** - Simplest form
2. **LifestyleForm** - Medium complexity
3. **ClinicalAssessmentForm** - Medium complexity
4. **BiochemicalsForm** - Complex nested data
5. **IDRSForm** - Complex scoring
6. **SummaryDashboard** - Uses `loadSubmittedAssessments`
7. **AdminDashboard** - Uses `loadMasterCSVData`

Each component update is independent - they can be done in any order.
