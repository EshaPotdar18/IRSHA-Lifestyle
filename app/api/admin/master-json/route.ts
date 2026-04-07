import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const assessments = await prisma.assessment.findMany({
    orderBy: { submittedAt: "desc" },
  })

  return NextResponse.json(assessments)
}
