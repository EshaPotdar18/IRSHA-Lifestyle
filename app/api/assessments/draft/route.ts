import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/assessments/draft
 * Fetch draft assessment for a user
 */
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const draft = await prisma.draftAssessment.findUnique({
      where: { userId },
    })

    if (!draft) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      id: draft.id,
      userId: draft.userId,
      basicInfo: draft.basicInfo,
      clinicalAssessment: draft.clinicalAssessment,
      lifestyle: draft.lifestyle,
      biochemical: draft.biochemical,
      idrs: draft.idrs,
      timestamp: draft.timestamp?.toISOString(),
      updatedAt: draft.updatedAt.toISOString(),
    })
  } catch (error) {
    console.error('Fetch draft failed:', error)
    return NextResponse.json(
      { error: 'Failed to fetch draft', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * POST /api/assessments/draft
 * Save or update draft assessment
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { userId, assessment } = data

    if (!userId || !assessment) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, assessment' },
        { status: 400 }
      )
    }

    // Ensure user exists (CRITICAL FIX)
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: `${userId}@temp.local`, // placeholder
        password: "oauth",             // placeholder
        name: "Employee",
        role: "employee",
      },
    })


    const draft = await prisma.draftAssessment.upsert({
      where: { userId },
      update: {
        basicInfo: assessment.basicInfo,
        clinicalAssessment: assessment.clinicalAssessment,
        lifestyle: assessment.lifestyle,
        biochemical: assessment.biochemical,
        idrs: assessment.idrs,
        timestamp: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId,
        basicInfo: assessment.basicInfo,
        clinicalAssessment: assessment.clinicalAssessment,
        lifestyle: assessment.lifestyle,
        biochemical: assessment.biochemical,
        idrs: assessment.idrs,
        timestamp: new Date(),
      },
    })

    return NextResponse.json(draft, { status: 201 })
  } catch (error) {
    console.error('Save draft failed:', error)
    return NextResponse.json(
      { error: 'Failed to save draft', details: String(error) },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/assessments/draft
 * Delete draft assessment
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    await prisma.draftAssessment.deleteMany({
      where: { userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete draft failed:', error)
    return NextResponse.json(
      { error: 'Failed to delete draft', details: String(error) },
      { status: 500 }
    )
  }
}
