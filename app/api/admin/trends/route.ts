// import { calculateTrendAnalysis } from "@/lib/storage"

// export async function GET() {
//   const trends = await calculateTrendAnalysis()
//   return Response.json(trends)
// }

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: { submittedAt: "desc" },
    })

    const totalAssessments = assessments.length

    const uniqueEmployees = new Set(
      assessments.map((a) => a.employeeId)
    )

    const totalEmployees = uniqueEmployees.size

    /* ---------- AGE ---------- */
    let ageSum = 0
    let ageCount = 0

    const ageDistribution = {
      "18-30": 0,
      "31-40": 0,
      "41-50": 0,
      "51-60": 0,
      "60+": 0,
    }

    assessments.forEach((a) => {
      const age = Number(a.basicInfo?.age)
      if (!isNaN(age)) {
        ageSum += age
        ageCount++

        if (age < 31) ageDistribution["18-30"]++
        else if (age < 41) ageDistribution["31-40"]++
        else if (age < 51) ageDistribution["41-50"]++
        else if (age < 61) ageDistribution["51-60"]++
        else ageDistribution["60+"]++
      }
    })

    const averageAge =
      ageCount > 0 ? Number((ageSum / ageCount).toFixed(1)) : 0

    /* ---------- BMI DISTRIBUTION ---------- */
    const bmiDistribution = {
    underweight: 0,
    normal: 0,
    overweight: 0,
    obese: 0,
    }

    assessments.forEach((a) => {
    const bmi = Number(a.clinicalAssessment?.bmi)

    if (!isNaN(bmi)) {
        if (bmi < 18.5) bmiDistribution.underweight++
        else if (bmi < 25) bmiDistribution.normal++
        else if (bmi < 30) bmiDistribution.overweight++
        else bmiDistribution.obese++
    }
    })


    /* ---------- HIGH RISK COUNT ---------- */
    const diabetesRiskCount = assessments.filter(
      (a) => Number(a.idrs?.score) >= 60
    ).length

    /* ---------- GLUCOSE STATS ---------- */
    const glucoseValues = assessments
      .map((a) => Number(a.clinicalAssessment?.bloodGlucose))
      .filter((v) => !isNaN(v))

    const glucoseStats = {
      avg:
        glucoseValues.length > 0
          ? Number(
              (
                glucoseValues.reduce((a, b) => a + b, 0) /
                glucoseValues.length
              ).toFixed(1)
            )
          : 0,
      min: glucoseValues.length > 0 ? Math.min(...glucoseValues) : 0,
      max: glucoseValues.length > 0 ? Math.max(...glucoseValues) : 0,
    }

    return NextResponse.json({
    totalAssessments,
    totalEmployees,
    averageAge,
    diabetesRiskCount,
    bmiDistribution, // 👈 ADD THIS
    ageDistribution: Object.entries(ageDistribution).map(
        ([risk, count]) => ({ risk, count })
    ),
    glucoseStats,
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to calculate trends" },
      { status: 500 }
    )
  }
}
