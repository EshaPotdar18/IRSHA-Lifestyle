// /**
//  * Database-backed storage layer (replaces localStorage)
//  * Provides the same API as the original storage.ts but persists to PostgreSQL
//  */

// import { prisma } from './prisma'

// export interface AssessmentData {
//   basicInfo: Record<string, any>
//   clinicalAssessment: Record<string, any>
//   lifestyle: Record<string, any>
//   biochemical: Record<string, any>
//   idrs: Record<string, any>
//   timestamp?: string
// }

// export interface SubmittedAssessment {
//   id: string
//   employeeId: string
//   employeeName: string
//   data: AssessmentData
//   submittedAt: string
//   status: "submitted" | "draft"
// }

// /**
//  * Save draft assessment data for a user
//  */
// export const saveAssessmentData = async (userId: string, data: AssessmentData): Promise<void> => {
//   try {
//     const dataWithTimestamp = {
//       ...data,
//       timestamp: new Date().toISOString(),
//     }

//     await prisma.draftAssessment.upsert({
//       where: { userId },
//       update: {
//         basicInfo: data.basicInfo,
//         clinicalAssessment: data.clinicalAssessment,
//         lifestyle: data.lifestyle,
//         biochemical: data.biochemical,
//         idrs: data.idrs,
//         timestamp: new Date(dataWithTimestamp.timestamp),
//         updatedAt: new Date(),
//       },
//       create: {
//         userId,
//         basicInfo: data.basicInfo,
//         clinicalAssessment: data.clinicalAssessment,
//         lifestyle: data.lifestyle,
//         biochemical: data.biochemical,
//         idrs: data.idrs,
//         timestamp: new Date(dataWithTimestamp.timestamp),
//       },
//     })
//   } catch (error) {
//     console.error("Error saving assessment data:", error)
//     throw error
//   }
// }

// /**
//  * Load draft assessment data for a user
//  */
// export const loadAssessmentData = async (userId: string): Promise<AssessmentData | null> => {
//   try {
//     const draft = await prisma.draftAssessment.findUnique({
//       where: { userId },
//     })

//     if (!draft) return null

//     return {
//       basicInfo: draft.basicInfo as Record<string, any>,
//       clinicalAssessment: draft.clinicalAssessment as Record<string, any>,
//       lifestyle: draft.lifestyle as Record<string, any>,
//       biochemical: draft.biochemical as Record<string, any>,
//       idrs: draft.idrs as Record<string, any>,
//       timestamp: draft.timestamp?.toISOString(),
//     }
//   } catch (error) {
//     console.error("Error loading assessment data:", error)
//     return null
//   }
// }

// /**
//  * Clear draft assessment data for a user
//  */
// export const clearAssessmentData = async (userId: string): Promise<void> => {
//   try {
//     await prisma.draftAssessment.deleteMany({
//       where: { userId },
//     })
//   } catch (error) {
//     console.error("Error clearing assessment data:", error)
//     throw error
//   }
// }

// /**
//  * Submit an assessment (move from draft to submitted)
//  */
// export const submitAssessment = async (
//   userId: string,
//   employeeId: string,
//   employeeName: string,
//   data: AssessmentData
// ): Promise<string> => {
//   try {
//     const assessment = await prisma.assessment.create({
//       data: {
//         userId,
//         employeeId,
//         employeeName,
//         basicInfo: data.basicInfo,
//         clinicalAssessment: data.clinicalAssessment,
//         lifestyle: data.lifestyle,
//         biochemical: data.biochemical,
//         idrs: data.idrs,
//         status: "submitted",
//         submittedAt: new Date(),
//       },
//     })

//     // Clear the draft after successful submission
//     await clearAssessmentData(userId)

//     return assessment.id
//   } catch (error) {
//     console.error("Error submitting assessment:", error)
//     throw error
//   }
// }

// /**
//  * Load all submitted assessments for a user
//  */
// export const loadSubmittedAssessments = async (userId: string): Promise<SubmittedAssessment[]> => {
//   try {
//     const assessments = await prisma.assessment.findMany({
//       where: { userId },
//       orderBy: { submittedAt: 'desc' },
//     })

//     return assessments.map((a) => ({
//       id: a.id,
//       employeeId: a.employeeId,
//       employeeName: a.employeeName,
//       submittedAt: a.submittedAt?.toISOString() || new Date().toISOString(),
//       status: a.status as "submitted" | "draft",
//       data: {
//         basicInfo: a.basicInfo as Record<string, any>,
//         clinicalAssessment: a.clinicalAssessment as Record<string, any>,
//         lifestyle: a.lifestyle as Record<string, any>,
//         biochemical: a.biochemical as Record<string, any>,
//         idrs: a.idrs as Record<string, any>,
//         timestamp: a.createdAt.toISOString(),
//       },
//     }))
//   } catch (error) {
//     console.error("Error loading submitted assessments:", error)
//     return []
//   }
// }

// /**
//  * Get assessments for a specific employee
//  */
// export const getEmployeeAssessments = async (employeeId: string): Promise<SubmittedAssessment[]> => {
//   try {
//     const assessments = await prisma.assessment.findMany({
//       where: { employeeId },
//       orderBy: { submittedAt: 'desc' },
//     })

//     return assessments.map((a) => ({
//       id: a.id,
//       employeeId: a.employeeId,
//       employeeName: a.employeeName,
//       submittedAt: a.submittedAt?.toISOString() || new Date().toISOString(),
//       status: a.status as "submitted" | "draft",
//       data: {
//         basicInfo: a.basicInfo as Record<string, any>,
//         clinicalAssessment: a.clinicalAssessment as Record<string, any>,
//         lifestyle: a.lifestyle as Record<string, any>,
//         biochemical: a.biochemical as Record<string, any>,
//         idrs: a.idrs as Record<string, any>,
//         timestamp: a.createdAt.toISOString(),
//       },
//     }))
//   } catch (error) {
//     console.error("Error getting employee assessments:", error)
//     return []
//   }
// }

// /**
//  * Load all submitted assessments across all users (for CSV/admin)
//  */
// export const loadMasterCSVData = async (): Promise<any[]> => {
//   try {
//     const assessments = await prisma.assessment.findMany({
//       orderBy: { submittedAt: 'desc' },
//     })

//     return assessments.map((a) => ({
//       assessmentId: a.id,
//       employeeId: a.employeeId,
//       employeeName: a.employeeName,
//       submittedAt: a.submittedAt?.toISOString() || new Date().toISOString(),
//       ...flattenDataWithNulls({
//         basicInfo: a.basicInfo as Record<string, any>,
//         clinicalAssessment: a.clinicalAssessment as Record<string, any>,
//         lifestyle: a.lifestyle as Record<string, any>,
//         biochemical: a.biochemical as Record<string, any>,
//         idrs: a.idrs as Record<string, any>,
//       }),
//     }))
//   } catch (error) {
//     console.error("Error loading master CSV data:", error)
//     return []
//   }
// }

// /**
//  * Utility function to flatten nested assessment data for CSV export
//  */
// const flattenDataWithNulls = (data: AssessmentData): Record<string, any> => {
//   const flattened: Record<string, any> = {}

//   const processSection = (section: string, obj: Record<string, any>) => {
//     if (!obj || typeof obj !== "object") return

//     Object.entries(obj).forEach(([key, value]) => {
//       const flatKey = `${section}_${key}`
//       if (value === "" || value === undefined || value === null) {
//         flattened[flatKey] = "null"
//       } else if (typeof value === "object" && !Array.isArray(value)) {
//         Object.entries(value).forEach(([nestedKey, nestedValue]) => {
//           const nestedFlatKey = `${flatKey}_${nestedKey}`
//           flattened[nestedFlatKey] =
//             nestedValue === "" || nestedValue === undefined || nestedValue === null ? "null" : nestedValue
//         })
//       } else if (Array.isArray(value)) {
//         flattened[flatKey] = value.length > 0 ? value.join(", ") : "null"
//       } else {
//         flattened[flatKey] = value
//       }
//     })
//   }

//   processSection("basicInfo", data.basicInfo || {})
//   processSection("clinicalAssessment", data.clinicalAssessment || {})
//   processSection("lifestyle", data.lifestyle || {})
//   processSection("biochemical", data.biochemical || {})
//   processSection("idrs", data.idrs || {})

//   return flattened
// }
