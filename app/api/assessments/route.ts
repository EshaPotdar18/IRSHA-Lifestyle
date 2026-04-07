import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/assessments
 * Submit a new assessment
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { userId, employeeId, employeeName, assessment } = data

    if (!userId || !employeeId || !employeeName || !assessment) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, employeeId, employeeName, assessment' },
        { status: 400 }
      )
    }

    // 🔐 Ensure user exists (CRITICAL FIX)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@temp.local`, // placeholder
        password: "oauth",             // placeholder
        name: employeeName,
        role: "employee",
        employeeId,
      },
    })


    const created = await prisma.assessment.create({
      data: {
        userId,
        employeeId,
        employeeName,
        basicInfo: assessment.basicInfo || {},
        clinicalAssessment: assessment.clinicalAssessment || {},
        lifestyle: assessment.lifestyle || {},
        biochemical: assessment.biochemical || {},
        idrs: assessment.idrs || {},
        status: 'submitted',
        submittedAt: new Date(),
      },
    })

    // Clear draft after submission
    await prisma.draftAssessment.deleteMany({
      where: { userId },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Assessment submission failed:', error)
    return NextResponse.json(
      { error: 'Failed to submit assessment', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * GET /api/assessments
 * Fetch assessments for a user or all assessments (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    const employeeId = request.nextUrl.searchParams.get('employeeId')
    const all = request.nextUrl.searchParams.get('all') === 'true'

    // Admin: get all assessments
    if (all) {
      const assessments = await prisma.assessment.findMany({
        orderBy: { submittedAt: 'desc' },
      })
      return NextResponse.json(assessments)
    }

    // Get user's assessments
    if (userId) {
      const assessments = await prisma.assessment.findMany({
        where: { userId },
        orderBy: { submittedAt: 'desc' },
      })
      return NextResponse.json(assessments)
    }

    // Get assessments for specific employee
    if (employeeId) {
      const assessments = await prisma.assessment.findMany({
        where: { employeeId },
        orderBy: { submittedAt: 'desc' },
      })
      return NextResponse.json(assessments)
    }

    return NextResponse.json(
      { error: 'Provide userId, employeeId, or all=true' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Fetch assessments failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assessments', details: String(error) },
      { status: 500 }
    )
  }
}
