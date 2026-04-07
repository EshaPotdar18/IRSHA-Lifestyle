export interface AssessmentData {
  basicInfo: Record<string, any>
  clinicalAssessment: Record<string, any>
  lifestyle: Record<string, any>
  biochemical: Record<string, any>
  idrs: Record<string, any>
  timestamp?: string
}

export interface SubmittedAssessment {
  id: string
  employeeId: string
  employeeName: string
  data: AssessmentData
  submittedAt: string
  status: "submitted" | "draft"
}

const STORAGE_KEY = "health_assessment_data"
const SUBMITTED_ASSESSMENTS_KEY = "submitted_assessments"
const ALL_DATA_CSV_KEY = "all_assessments_csv"

export const saveAssessmentData = (data: AssessmentData): void => {
  try {
    const dataWithTimestamp = {
      ...data,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp))
  } catch (error) {
    console.error("Error saving assessment data:", error)
  }
}

export const loadAssessmentData = (): AssessmentData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error loading assessment data:", error)
    return null
  }
}

export const clearAssessmentData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing assessment data:", error)
  }
}

export const submitAssessment = (employeeId: string, employeeName: string, data: AssessmentData): string => {
  try {
    const submitted = loadSubmittedAssessments()
    const assessmentId = `ASS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const newAssessment: SubmittedAssessment = {
      id: assessmentId,
      employeeId,
      employeeName,
      data,
      submittedAt: new Date().toISOString(),
      status: "submitted",
    }

    submitted.push(newAssessment)
    localStorage.setItem(SUBMITTED_ASSESSMENTS_KEY, JSON.stringify(submitted))

    // Also add to master CSV data for ML analysis
    updateMasterCSVData(newAssessment)

    return assessmentId
  } catch (error) {
    console.error("Error submitting assessment:", error)
    throw error
  }
}

export const loadSubmittedAssessments = (): SubmittedAssessment[] => {
  try {
    const data = localStorage.getItem(SUBMITTED_ASSESSMENTS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error loading submitted assessments:", error)
    return []
  }
}

export const getEmployeeAssessments = (employeeId: string): SubmittedAssessment[] => {
  const all = loadSubmittedAssessments()
  return all.filter((a) => a.employeeId === employeeId)
}

export const updateMasterCSVData = (assessment: SubmittedAssessment): void => {
  try {
    const csvData = loadMasterCSVData()
    csvData.push({
      assessmentId: assessment.id,
      employeeId: assessment.employeeId,
      employeeName: assessment.employeeName,
      submittedAt: assessment.submittedAt,
      ...flattenDataWithNulls(assessment.data),
    })
    localStorage.setItem(ALL_DATA_CSV_KEY, JSON.stringify(csvData))
  } catch (error) {
    console.error("Error updating master CSV data:", error)
  }
}

export const loadMasterCSVData = (): any[] => {
  try {
    const data = localStorage.getItem(ALL_DATA_CSV_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error loading master CSV data:", error)
    return []
  }
}

const flattenDataWithNulls = (data: AssessmentData): Record<string, any> => {
  const flattened: Record<string, any> = {}

  const processSection = (section: string, obj: Record<string, any>) => {
    if (!obj || typeof obj !== "object") return

    Object.entries(obj).forEach(([key, value]) => {
      const flatKey = `${section}_${key}`
      // Store empty strings, undefined, or actual null as "null" string for CSV
      if (value === "" || value === undefined || value === null) {
        flattened[flatKey] = "null"
      } else if (typeof value === "object" && !Array.isArray(value)) {
        // Handle nested objects (like physicalActivity, regularity, etc.)
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          const nestedFlatKey = `${flatKey}_${nestedKey}`
          flattened[nestedFlatKey] =
            nestedValue === "" || nestedValue === undefined || nestedValue === null ? "null" : nestedValue
        })
      } else if (Array.isArray(value)) {
        // Handle arrays by joining or stringifying
        flattened[flatKey] = value.length > 0 ? value.join(", ") : "null"
      } else {
        flattened[flatKey] = value
      }
    })
  }

  processSection("basicInfo", data.basicInfo || {})
  processSection("clinicalAssessment", data.clinicalAssessment || {})
  processSection("lifestyle", data.lifestyle || {})
  processSection("biochemical", data.biochemical || {})
  processSection("idrs", data.idrs || {})

  return flattened
}

export const exportAssessmentAsJSON = (data: AssessmentData): void => {
  try {
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `health_assessment_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error exporting assessment data:", error)
  }
}

export const exportAssessmentAsCSV = (data: AssessmentData): void => {
  try {
    let csv = "Health Assessment Report\n"
    csv += `Generated: ${new Date().toLocaleString()}\n\n`

    const addSection = (title: string, section: Record<string, any>) => {
      csv += `${title}\n`
      Object.entries(section || {}).forEach(([key, value]) => {
        let displayValue = value
        if (value === null || value === "" || value === undefined) {
          displayValue = "null"
        } else if (typeof value === "object") {
          displayValue = JSON.stringify(value)
        }
        csv += `${key},${displayValue}\n`
      })
      csv += "\n"
    }

    addSection("PERSONAL INFORMATION", data.basicInfo)
    addSection("CLINICAL ASSESSMENT", data.clinicalAssessment)
    addSection("LIFESTYLE ASSESSMENT", data.lifestyle)
    addSection("BIOCHEMICAL ANALYSIS", data.biochemical)
    addSection("IDRS SCREENING", data.idrs)

    const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(csvBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `health_assessment_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error exporting assessment data as CSV:", error)
  }
}

export const exportMasterDataAsCSV = (): void => {
  try {
    const csvData = loadMasterCSVData()
    if (csvData.length === 0) {
      alert("No assessment data available to export")
      return
    }

    const headers = Object.keys(csvData[0])
    let csv = headers.join(",") + "\n"

    csvData.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header]
        const displayValue =
          value === null || value === "" || value === undefined
            ? "null"
            : String(value).includes(",")
              ? `"${value}"`
              : value
        return displayValue
      })
      csv += values.join(",") + "\n"
    })

    const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(csvBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `all_assessments_master_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error exporting master CSV:", error)
  }
}

export const calculateTrendAnalysis = (): {
  totalAssessments: number
  totalEmployees: number
  averageAge: number
  bmiDistribution: Record<string, number>
  glucoseStats: { avg: number; min: number; max: number }
  diabetesRiskCount: number
} => {
  try {
    const csvData = loadMasterCSVData()
    if (csvData.length === 0) {
      return {
        totalAssessments: 0,
        totalEmployees: 0,
        averageAge: 0,
        bmiDistribution: {},
        glucoseStats: { avg: 0, min: 0, max: 0 },
        diabetesRiskCount: 0,
      }
    }

    const uniqueEmployees = new Set(csvData.map((d) => d.employeeId)).size

    let totalAge = 0
    let ageCount = 0
    const ages: number[] = []
    const glucoses: number[] = []
    let diabetesRisk = 0

    csvData.forEach((row) => {
      if (row.basicInfo_age && row.basicInfo_age !== null) {
        const age = Number.parseInt(row.basicInfo_age)
        if (!isNaN(age)) {
          totalAge += age
          ageCount++
          ages.push(age)
        }
      }
      if (row.clinicalAssessment_bloodGlucose && row.clinicalAssessment_bloodGlucose !== null) {
        const glucose = Number.parseFloat(row.clinicalAssessment_bloodGlucose)
        if (!isNaN(glucose)) glucoses.push(glucose)
      }
      if (row.idrs_score && Number.parseInt(row.idrs_score) >= 60) {
        diabetesRisk++
      }
    })

    return {
      totalAssessments: csvData.length,
      totalEmployees: uniqueEmployees,
      averageAge: ageCount > 0 ? Math.round(totalAge / ageCount) : 0,
      bmiDistribution: calculateBMIDistribution(csvData),
      glucoseStats: {
        avg: glucoses.length > 0 ? Math.round(glucoses.reduce((a, b) => a + b, 0) / glucoses.length) : 0,
        min: glucoses.length > 0 ? Math.min(...glucoses) : 0,
        max: glucoses.length > 0 ? Math.max(...glucoses) : 0,
      },
      diabetesRiskCount: diabetesRisk,
    }
  } catch (error) {
    console.error("Error calculating trend analysis:", error)
    return {
      totalAssessments: 0,
      totalEmployees: 0,
      averageAge: 0,
      bmiDistribution: {},
      glucoseStats: { avg: 0, min: 0, max: 0 },
      diabetesRiskCount: 0,
    }
  }
}

const calculateBMIDistribution = (data: any[]): Record<string, number> => {
  const distribution = {
    underweight: 0,
    normal: 0,
    overweight: 0,
    obese: 0,
    unknown: 0,
  }

  data.forEach((row) => {
    const bmi = Number.parseFloat(row.clinicalAssessment_bmi)
    if (!isNaN(bmi)) {
      if (bmi < 18.5) distribution.underweight++
      else if (bmi < 25) distribution.normal++
      else if (bmi < 30) distribution.overweight++
      else distribution.obese++
    } else {
      distribution.unknown++
    }
  })

  return distribution
}


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
//   status: 'submitted' | 'draft'
// }

// const STORAGE_KEY = "health_assessment_data"
// const SUBMITTED_ASSESSMENTS_KEY = "submitted_assessments"
// const ALL_DATA_CSV_KEY = "all_assessments_csv"

// export const saveAssessmentData = (data: AssessmentData): void => {
//   try {
//     const dataWithTimestamp = {
//       ...data,
//       timestamp: new Date().toISOString(),
//     }
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp))
//   } catch (error) {
//     console.error("Error saving assessment data:", error)
//   }
// }

// export const loadAssessmentData = (): AssessmentData | null => {
//   try {
//     const data = localStorage.getItem(STORAGE_KEY)
//     return data ? JSON.parse(data) : null
//   } catch (error) {
//     console.error("Error loading assessment data:", error)
//     return null
//   }
// }

// export const clearAssessmentData = (): void => {
//   try {
//     localStorage.removeItem(STORAGE_KEY)
//   } catch (error) {
//     console.error("Error clearing assessment data:", error)
//   }
// }

// export const submitAssessment = (employeeId: string, employeeName: string, data: AssessmentData): string => {
//   try {
//     const submitted = loadSubmittedAssessments()
//     const assessmentId = `ASS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
//     const newAssessment: SubmittedAssessment = {
//       id: assessmentId,
//       employeeId,
//       employeeName,
//       data,
//       submittedAt: new Date().toISOString(),
//       status: 'submitted'
//     }
    
//     submitted.push(newAssessment)
//     localStorage.setItem(SUBMITTED_ASSESSMENTS_KEY, JSON.stringify(submitted))
    
//     // Also add to master CSV data for ML analysis
//     updateMasterCSVData(newAssessment)
    
//     return assessmentId
//   } catch (error) {
//     console.error("Error submitting assessment:", error)
//     throw error
//   }
// }

// export const loadSubmittedAssessments = (): SubmittedAssessment[] => {
//   try {
//     const data = localStorage.getItem(SUBMITTED_ASSESSMENTS_KEY)
//     return data ? JSON.parse(data) : []
//   } catch (error) {
//     console.error("Error loading submitted assessments:", error)
//     return []
//   }
// }

// export const getEmployeeAssessments = (employeeId: string): SubmittedAssessment[] => {
//   const all = loadSubmittedAssessments()
//   return all.filter(a => a.employeeId === employeeId)
// }

// export const updateMasterCSVData = (assessment: SubmittedAssessment): void => {
//   try {
//     const csvData = loadMasterCSVData()
//     csvData.push({
//       assessmentId: assessment.id,
//       employeeId: assessment.employeeId,
//       employeeName: assessment.employeeName,
//       submittedAt: assessment.submittedAt,
//       ...flattenDataWithNulls(assessment.data)
//     })
//     localStorage.setItem(ALL_DATA_CSV_KEY, JSON.stringify(csvData))
//   } catch (error) {
//     console.error("Error updating master CSV data:", error)
//   }
// }

// export const loadMasterCSVData = (): any[] => {
//   try {
//     const data = localStorage.getItem(ALL_DATA_CSV_KEY)
//     return data ? JSON.parse(data) : []
//   } catch (error) {
//     console.error("Error loading master CSV data:", error)
//     return []
//   }
// }

// const flattenDataWithNulls = (data: AssessmentData): Record<string, any> => {
//   const flattened: Record<string, any> = {}
  
//   const processSection = (section: string, obj: Record<string, any>) => {
//     Object.entries(obj || {}).forEach(([key, value]) => {
//       const flatKey = `${section}_${key}`
//       flattened[flatKey] = value === '' || value === undefined ? null : value
//     })
//   }
  
//   processSection('basicInfo', data.basicInfo || {})
//   processSection('clinicalAssessment', data.clinicalAssessment || {})
//   processSection('lifestyle', data.lifestyle || {})
//   processSection('biochemical', data.biochemical || {})
//   processSection('idrs', data.idrs || {})
  
//   return flattened
// }

// export const exportAssessmentAsJSON = (data: AssessmentData): void => {
//   try {
//     const dataStr = JSON.stringify(data, null, 2)
//     const dataBlob = new Blob([dataStr], { type: "application/json" })
//     const url = URL.createObjectURL(dataBlob)
//     const link = document.createElement("a")
//     link.href = url
//     link.download = `health_assessment_${new Date().toISOString().split("T")[0]}.json`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     URL.revokeObjectURL(url)
//   } catch (error) {
//     console.error("Error exporting assessment data:", error)
//   }
// }

// export const exportAssessmentAsCSV = (data: AssessmentData): void => {
//   try {
//     let csv = "Health Assessment Report\n"
//     csv += `Generated: ${new Date().toLocaleString()}\n\n`

//     const addSection = (title: string, section: Record<string, any>) => {
//       csv += `${title}\n`
//       Object.entries(section || {})
//         .forEach(([key, value]) => {
//           const displayValue = value === null || value === '' ? 'null' : value
//           csv += `${key},${displayValue}\n`
//         })
//       csv += "\n"
//     }

//     addSection("PERSONAL INFORMATION", data.basicInfo)
//     addSection("CLINICAL ASSESSMENT", data.clinicalAssessment)
//     addSection("LIFESTYLE ASSESSMENT", data.lifestyle)
//     addSection("BIOCHEMICAL ANALYSIS", data.biochemical)
//     addSection("IDRS SCREENING", data.idrs)

//     const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
//     const url = URL.createObjectURL(csvBlob)
//     const link = document.createElement("a")
//     link.href = url
//     link.download = `health_assessment_${new Date().toISOString().split("T")[0]}.csv`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     URL.revokeObjectURL(url)
//   } catch (error) {
//     console.error("Error exporting assessment data as CSV:", error)
//   }
// }

// export const exportMasterDataAsCSV = (): void => {
//   try {
//     const csvData = loadMasterCSVData()
//     if (csvData.length === 0) {
//       alert("No assessment data available to export")
//       return
//     }

//     const headers = Object.keys(csvData[0])
//     let csv = headers.join(",") + "\n"
    
//     csvData.forEach(row => {
//       const values = headers.map(header => {
//         const value = row[header]
//         const displayValue = value === null || value === '' ? 'null' : String(value).includes(',') ? `"${value}"` : value
//         return displayValue
//       })
//       csv += values.join(",") + "\n"
//     })

//     const csvBlob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
//     const url = URL.createObjectURL(csvBlob)
//     const link = document.createElement("a")
//     link.href = url
//     link.download = `all_assessments_${new Date().toISOString().split("T")[0]}.csv`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     URL.revokeObjectURL(url)
//   } catch (error) {
//     console.error("Error exporting master CSV:", error)
//   }
// }

// export const calculateTrendAnalysis = (): {
//   totalAssessments: number
//   totalEmployees: number
//   averageAge: number
//   bmiDistribution: Record<string, number>
//   glucoseStats: { avg: number; min: number; max: number }
//   diabetesRiskCount: number
// } => {
//   try {
//     const csvData = loadMasterCSVData()
//     if (csvData.length === 0) {
//       return {
//         totalAssessments: 0,
//         totalEmployees: 0,
//         averageAge: 0,
//         bmiDistribution: {},
//         glucoseStats: { avg: 0, min: 0, max: 0 },
//         diabetesRiskCount: 0
//       }
//     }

//     const uniqueEmployees = new Set(csvData.map(d => d.employeeId)).size
    
//     let totalAge = 0
//     let ageCount = 0
//     const ages: number[] = []
//     const glucoses: number[] = []
//     let diabetesRisk = 0

//     csvData.forEach(row => {
//       if (row.basicInfo_age && row.basicInfo_age !== null) {
//         const age = parseInt(row.basicInfo_age)
//         if (!isNaN(age)) {
//           totalAge += age
//           ageCount++
//           ages.push(age)
//         }
//       }
//       if (row.clinicalAssessment_bloodGlucose && row.clinicalAssessment_bloodGlucose !== null) {
//         const glucose = parseFloat(row.clinicalAssessment_bloodGlucose)
//         if (!isNaN(glucose)) glucoses.push(glucose)
//       }
//       if (row.idrs_score && parseInt(row.idrs_score) >= 60) {
//         diabetesRisk++
//       }
//     })

//     return {
//       totalAssessments: csvData.length,
//       totalEmployees: uniqueEmployees,
//       averageAge: ageCount > 0 ? Math.round(totalAge / ageCount) : 0,
//       bmiDistribution: calculateBMIDistribution(csvData),
//       glucoseStats: {
//         avg: glucoses.length > 0 ? Math.round(glucoses.reduce((a, b) => a + b, 0) / glucoses.length) : 0,
//         min: glucoses.length > 0 ? Math.min(...glucoses) : 0,
//         max: glucoses.length > 0 ? Math.max(...glucoses) : 0
//       },
//       diabetesRiskCount: diabetesRisk
//     }
//   } catch (error) {
//     console.error("Error calculating trend analysis:", error)
//     return {
//       totalAssessments: 0,
//       totalEmployees: 0,
//       averageAge: 0,
//       bmiDistribution: {},
//       glucoseStats: { avg: 0, min: 0, max: 0 },
//       diabetesRiskCount: 0
//     }
//   }
// }

// const calculateBMIDistribution = (data: any[]): Record<string, number> => {
//   const distribution = {
//     underweight: 0,
//     normal: 0,
//     overweight: 0,
//     obese: 0,
//     unknown: 0
//   }

//   data.forEach(row => {
//     const bmi = parseFloat(row.clinicalAssessment_bmi)
//     if (!isNaN(bmi)) {
//       if (bmi < 18.5) distribution.underweight++
//       else if (bmi < 25) distribution.normal++
//       else if (bmi < 30) distribution.overweight++
//       else distribution.obese++
//     } else {
//       distribution.unknown++
//     }
//   })

//   return distribution
// }
