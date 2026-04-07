import { prisma } from "@/lib/prisma"

export async function calculateTrendAnalysis() {
  const assessments = await prisma.assessment.findMany()

  const totalAssessments = assessments.length

  const uniqueEmployees = new Set(
    assessments.map(a => a.employeeId)
  ).size

  // compute age, BMI, IDRS, etc here directly from DB rows

  return {
    totalAssessments,
    totalEmployees: uniqueEmployees,
    ...
  }
}
