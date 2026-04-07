import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

function flattenObject(obj: any, prefix = ""): Record<string, any> {
  return Object.keys(obj || {}).reduce((acc: any, key) => {
    const value = obj[key]
    const newKey = prefix ? `${prefix}_${key}` : key

    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      Object.assign(acc, flattenObject(value, newKey))
    } else {
      acc[newKey] = value ?? ""
    }

    return acc
  }, {})
}

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      orderBy: { submittedAt: "desc" },
    })

    if (!assessments.length) {
      return new NextResponse("No data found", { status: 404 })
    }

    // Flatten nested JSON columns
    const flattened = assessments.map((a) => flattenObject(a))

    const headers = Object.keys(flattened[0])

    const csvRows = [
      headers.join(","), // header row
      ...flattened.map((row) =>
        headers
          .map((field) => `"${String(row[field]).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ]

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="master-data.csv"',
      },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse("Export failed", { status: 500 })
  }
}


// import { prisma } from "@/lib/prisma"
// import { NextResponse } from "next/server"

// export async function GET() {
//   const assessments = await prisma.assessment.findMany()

//   return NextResponse.json(assessments)
// }
// ...............................

// import { prisma } from "@/lib/prisma"
// import { NextResponse } from "next/server"
// import { flattenAssessment } from "@/lib/flatten"

// export async function GET() {
//   const assessments = await prisma.assessment.findMany({
//     orderBy: { submittedAt: "desc" },
//   })

//   const rows = assessments.map(flattenAssessment)

//   if (rows.length === 0) {
//     return new NextResponse("No data", { status: 400 })
//   }


//   const headers = Object.keys(rows[0])
//   const csv = [
//     headers.join(","),
//     ...rows.map(r =>
//     headers.map(h => {
//     const value = r[h] ?? ""
//     return `"${String(value).replace(/"/g, '""')}"`
//     }).join(","))
//   ].join("\n")

//   return new NextResponse(csv, {
//     headers: {
//       "Content-Type": "text/csv",
//       "Content-Disposition": `attachment; filename="master_assessments.csv"`,
//     },
//   })
// }
