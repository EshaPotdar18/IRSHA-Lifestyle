"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { submitAssessment } from "@/lib/storage"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"
import type { JSX } from "react"

/* -------------------------------------------------- */

interface SummaryDashboardProps {
  data: {
    basicInfo: any
    clinicalAssessment: any
    lifestyle: any
    biochemical: {
      values?: any
      flags?: any
      prakriti?: any
    }
    idrs: any
  }
  onEdit: () => void
  onNewAssessment: () => void
}

/* -------------------------------------------------- */

const displayValue = (value: any): JSX.Element | string => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-red-500 font-semibold">null</span>
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : <span className="text-red-500 font-semibold">null</span>
  }

  if (typeof value === "object") {
    return JSON.stringify(value)
  }

  return String(value)
}

/* -------------------------------------------------- */

const renderSection = (sectionData: any) => {
  // 🔴 SECTION EXISTS BUT NOTHING FILLED → SHOW NULL
  if (!sectionData || Object.keys(sectionData).length === 0) {
    return (
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
        <span className="text-red-500 font-semibold text-lg">null</span>
        <p className="text-sm text-slate-500 mt-1">No values provided</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(sectionData).map(([key, value]) => {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          return (
            <div key={key} className="col-span-full border-t pt-4 mt-2">
              <h4 className="text-sm font-bold text-slate-700 capitalize mb-2">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(value).map(([nestedKey, nestedValue]) => (
                  <div key={nestedKey} className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 capitalize">{nestedKey.replace(/([A-Z])/g, " $1").trim()}</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1">{displayValue(nestedValue)}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        return (
          <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
            <p className="text-sm font-semibold text-slate-900 mt-1">{displayValue(value)}</p>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------- */

export default function SummaryDashboard({ data, onEdit, onNewAssessment }: SummaryDashboardProps) {
  // const { user } = useAuth()
  const { user, logout } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleSubmitAssessment = async () => {
  try {
    setIsSubmitting(true)

    const res = await fetch("/api/assessments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id,
        employeeId: user?.employeeId || "EMP-001",
        employeeName: user?.name || "Unknown",
        assessment: data,
      }),
    })

    if (!res.ok) {
      throw new Error("Submission failed")
    }

    const saved = await res.json()

    setSubmitMessage(`✓ Assessment submitted successfully! ID: ${saved.id}`)

    setTimeout(() => {
      setSubmitMessage("")
      onNewAssessment()
    }, 2000)
  } catch (err) {
    console.error(err)
    setSubmitMessage("Error submitting assessment.")
  } finally {
    setIsSubmitting(false)
  }
}


  // const handleSubmitAssessment = async () => {
  //   try {
  //     setIsSubmitting(true)
  //     const id = submitAssessment(user?.id || "employee-001", user?.name || "Unknown", data)
  //     setSubmitMessage(`✓ Assessment submitted successfully! ID: ${id}`)
  //     setTimeout(() => {
  //       setSubmitMessage("")
  //       onNewAssessment()
  //     }, 2000)
  //   } catch {
  //     setSubmitMessage("Error submitting assessment.")
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  /* -------------------------------------------------- */

  return (
      <div className="min-h-screen bg-white">
    {/* HEADER */}
    <header className="shadow-md">
      <div className="w-full bg-gradient-to-r from-[#004aad] via-[#0077ff] to-[#00c6ff]">
        <div className="w-full flex items-center justify-between gap-6 text-white px-6 py-4">
          {/* Left Side */}
          <div className="flex items-center gap-6">
            <Image
              src="/white-logo.png"
              alt="Logo"
              width={220}
              height={220}
              className="object-contain"
            />
            <div className="space-y-2 leading-tight">
              <p className="text-2xl font-semibold">
                Mapping Lifestyle Patterns in Obesity & Diabetes
              </p>

              <p className="text-sm opacity-90">
                Principal Investigator:{" "}
                <span className="font-medium">Dr. Supriya Bhalerao</span>
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-sm opacity-90">
              Welcome, {user?.name}
            </span>
            <span className="text-xs opacity-80">
              {user?.employeeId}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = "/login"
              }}
              className="mt-2 bg-white text-blue-600 hover:bg-slate-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
{/* <div className="min-h-screen bg-slate-50"> */}
      <main className="mx-auto max-w-6xl px-4 py-8">            
      {/* REVIEW / SUMMARY HEADING */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">
          Assessment Review & Final Submission
        </h2>
        <p className="mt-2 text-slate-600 text-base">
          Please carefully review all entered information below before submitting your assessment.
          Once submitted, the record will be saved to the system database.
        </p>
      </div>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-slate-100 p-1 rounded-lg">
          <TabsTrigger className="w-full text-center" value="basic">Basic</TabsTrigger>
          <TabsTrigger className="w-full text-center" value="clinical">Clinical</TabsTrigger>
          <TabsTrigger className="w-full text-center" value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger className="w-full text-center" value="idrs">IDRS</TabsTrigger>
          <TabsTrigger className="w-full text-center" value="biochemical">Biochemical</TabsTrigger>
        </TabsList>

          {/* BASIC */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>{renderSection(data.basicInfo)}</CardContent>
            </Card>
          </TabsContent>

          {/* CLINICAL */}
          <TabsContent value="clinical">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Assessment</CardTitle>
              </CardHeader>
              <CardContent>{renderSection(data.clinicalAssessment)}</CardContent>
            </Card>
          </TabsContent>

          {/* LIFESTYLE */}
          <TabsContent value="lifestyle">
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle</CardTitle>
              </CardHeader>
              <CardContent>{renderSection(data.lifestyle)}</CardContent>
            </Card>
          </TabsContent>

          {/* IDRS */}
          <TabsContent value="idrs">
            <Card>
              <CardHeader>
                <CardTitle>IDRS</CardTitle>
              </CardHeader>
              <CardContent>{renderSection(data.idrs)}</CardContent>
            </Card>
          </TabsContent>
          

          {/* BIOCHEMICAL (FIXED) */}
          <TabsContent value="biochemical">
            <Card>
              <CardHeader>
                <CardTitle>Biochemical & Prakriti</CardTitle>
                <CardDescription>Lab values, flags and prakriti analysis</CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* LAB VALUES */}
                <div>
                  <h3 className="font-semibold mb-3">Biochemical Values</h3>
                  {renderSection(data.biochemical?.values)}
                </div>

                {/* FLAGS */}
                <div>
                  <h3 className="font-semibold mb-3">Reference Flags</h3>
                  {renderSection(data.biochemical?.flags)}
                </div>

                {/* PRAKRITI */}
                <div>
                  <h3 className="font-semibold mb-3">Prakriti Analysis</h3>
                  {renderSection(data.biochemical?.prakriti)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ACTIONS */}
        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={onEdit}>
            Edit Assessment
          </Button>
          <Button onClick={handleSubmitAssessment}>Submit Assessment</Button>
        </div>
        {submitMessage && (
          <p className="mt-4 text-sm font-semibold text-green-600">{submitMessage}</p>
        )}
      </main>
    </div>
  )
}

// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { exportAssessmentAsJSON, exportAssessmentAsCSV, submitAssessment } from "@/lib/storage"
// import { useAuth } from "@/hooks/use-auth"
// import type { JSX } from "react"

// interface SummaryDashboardProps {
//   data: {
//     basicInfo: any
//     clinicalAssessment: any
//     lifestyle: any
//     biochemical: {
//       values?: any
//       flags?: any
//       prakriti?: any
//     }
//     idrs: any
//   }
//   onEdit: () => void
//   onNewAssessment: () => void
// }

// const displayValue = (value: any): string | JSX.Element => {
//   if (value === null || value === "" || value === undefined) {
//     return <span className="text-red-500 font-semibold">null</span>
//   }
//   if (typeof value === "object" && !Array.isArray(value)) {
//     return JSON.stringify(value)
//   }
//   if (Array.isArray(value)) {
//     return value.join(", ") || <span className="text-red-500 font-semibold">null</span>
//   }
//   return String(value)
// }

// /* -------------------------------------------------- */

// const renderSection = (sectionData: any) => {
//   if (!sectionData || Object.keys(sectionData).length === 0) {
//     return (
//       <div className="text-center py-8 text-slate-500">
//         No data entered for this section
//       </div>
//     )
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {Object.entries(sectionData).map(([key, value]) => (
//         <div
//           key={key}
//           className="bg-slate-50 p-3 rounded-lg border border-slate-200"
//         >
//           <p className="text-xs text-slate-600 capitalize">
//             {key.replace(/([A-Z])/g, " $1").trim()}
//           </p>
//           <p className="text-sm font-semibold text-slate-900 mt-1">
//             {displayValue(value)}
//           </p>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default function SummaryDashboard({ data, onEdit, onNewAssessment }: SummaryDashboardProps) {
//   const { user } = useAuth()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitMessage, setSubmitMessage] = useState("")

//   const handleSubmitAssessment = async () => {
//     try {
//       setIsSubmitting(true)
//       const assessmentId = submitAssessment(user?.id || "employee-001", user?.name || "Unknown Employee", data)
//       setSubmitMessage(`✓ Assessment submitted successfully! ID: ${assessmentId}`)
//       setTimeout(() => {
//         setSubmitMessage("")
//         onNewAssessment()
//       }, 2000)
//     } catch (error) {
//       setSubmitMessage("Error submitting assessment. Please try again.")
//       console.error(error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const renderAllFields = (sectionData: any, title: string) => {
//     if (!sectionData || Object.keys(sectionData).length === 0) {
//       return <div className="text-center py-8 text-slate-500">No data entered for this section</div>
//     }

//     return (
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {Object.entries(sectionData).map(([key, value]: [string, any]) => {
//           // Handle nested objects
//           if (typeof value === "object" && !Array.isArray(value) && value !== null) {
//             return (
//               <div key={key} className="col-span-full">
//                 <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
//                   <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize mb-2">
//                     {key.replace(/([A-Z])/g, " $1").trim()}
//                   </p>
//                   <div className="grid grid-cols-2 gap-2 ml-4">
//                     {Object.entries(value).map(([nestedKey, nestedValue]: [string, any]) => (
//                       <div key={nestedKey} className="bg-white dark:bg-slate-700 p-2 rounded">
//                         <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
//                           {nestedKey.replace(/([A-Z])/g, " $1").trim()}
//                         </p>
//                         <p className="text-sm font-semibold text-slate-900 dark:text-white">
//                           {displayValue(nestedValue)}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )
//           }

//           return (
//             <div
//               key={key}
//               className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
//             >
//               <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
//                 {key.replace(/([A-Z])/g, " $1").trim()}
//               </p>
//               <p className="text-base font-semibold text-slate-900 dark:text-white mt-1">{displayValue(value)}</p>
//             </div>
//           )
//         })}
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <header className="border-b border-slate-200 bg-white shadow-sm">
//         <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
//           <div className="flex flex-col gap-2">
//             <h1 className="text-3xl font-bold text-slate-900">Health Assessment Summary</h1>
//             <p className="text-sm text-slate-600">Review your complete health profile - all form data captured</p>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
//         <Tabs defaultValue="basic" className="w-full">
//           <TabsList className="grid w-full grid-cols-5 gap-2 bg-slate-100 p-1 mb-6">
//             <TabsTrigger
//               value="basic"
//               className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
//             >
//               Basic Info
//             </TabsTrigger>
//             <TabsTrigger
//               value="clinical"
//               className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
//             >
//               Clinical
//             </TabsTrigger>
//             <TabsTrigger
//               value="lifestyle"
//               className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
//             >
//               Lifestyle
//             </TabsTrigger>
//             <TabsTrigger
//               value="idrs"
//               className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
//             >
//               IDRS
//             </TabsTrigger>
//             <TabsTrigger
//               value="biochemical"
//               className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
//             >
//               BioChemical
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="basic" className="space-y-6">
//             <Card className="border-slate-200 shadow-lg">
//               <CardHeader className="bg-slate-50 border-b border-slate-200">
//                 <CardTitle className="text-lg text-slate-900">Personal Information - All Fields</CardTitle>
//                 <CardDescription>Complete basic information captured from the form</CardDescription>
//               </CardHeader>
//               <CardContent className="pt-6">{renderAllFields(data.basicInfo, "Basic Information")}</CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="clinical" className="space-y-6">
//             <Card className="border-slate-200 shadow-lg">
//               <CardHeader className="bg-slate-50 border-b border-slate-200">
//                 <CardTitle className="text-lg text-slate-900">Clinical Assessment - All Fields</CardTitle>
//                 <CardDescription>Complete clinical measurements and assessments</CardDescription>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 {renderAllFields(data.clinicalAssessment, "Clinical Assessment")}
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="lifestyle" className="space-y-6">
//             <Card className="border-slate-200 shadow-lg">
//               <CardHeader className="bg-slate-50 border-b border-slate-200">
//                 <CardTitle className="text-lg text-slate-900">Lifestyle Assessment - All Fields</CardTitle>
//                 <CardDescription>Complete lifestyle and behavioral data</CardDescription>
//               </CardHeader>
//               <CardContent className="pt-6">{renderAllFields(data.lifestyle, "Lifestyle")}</CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="idrs" className="space-y-6">
//             <Card className="border-slate-200 shadow-lg bg-gradient-to-br from-blue-50 to-slate-50">
//               <CardHeader className="bg-blue-100 border-b border-blue-200">
//                 <CardTitle className="text-lg text-slate-900">IDRS Assessment - All Fields</CardTitle>
//                 <CardDescription>Complete diabetes risk assessment data</CardDescription>
//               </CardHeader>
//               <CardContent className="pt-6">{renderAllFields(data.idrs, "IDRS")}</CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="biochemical">
//             <Card className="border-slate-200 shadow-lg">
//               <CardHeader className="bg-slate-50 border-b border-slate-200">
//                 <CardTitle className="text-lg text-slate-900">Biochemical Analysis - All Fields</CardTitle>
//                 <CardDescription>Complete biochemical and Prakriti data</CardDescription>
//               </CardHeader>
//               <CardContent className="pt-6">{renderAllFields(data.biochemical, "Biochemical")}</CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>

//         <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6">
//           {submitMessage && (
//             <div
//               className={`p-4 rounded-lg ${submitMessage.includes("successfully") ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}
//             >
//               {submitMessage}
//             </div>
//           )}
//           <div className="flex flex-wrap justify-between gap-3">
//             <Button
//               onClick={onEdit}
//               variant="outline"
//               className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
//             >
//               Edit Assessment
//             </Button>
//             <div className="flex flex-wrap gap-3">
//               <Button
//                 onClick={() => exportAssessmentAsJSON(data)}
//                 variant="outline"
//                 className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
//               >
//                 Export as JSON
//               </Button>
//               <Button
//                 onClick={() => exportAssessmentAsCSV(data)}
//                 variant="outline"
//                 className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
//               >
//                 Export as CSV
//               </Button>
//               <Button
//                 onClick={onNewAssessment}
//                 variant="outline"
//                 className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
//               >
//                 New Assessment
//               </Button>
//               <Button
//                 onClick={handleSubmitAssessment}
//                 disabled={isSubmitting}
//                 className="bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 {isSubmitting ? "Submitting..." : "Submit Assessment"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
