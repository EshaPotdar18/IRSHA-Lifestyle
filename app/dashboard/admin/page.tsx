"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import AnimatedMedicalBackground from "@/components/animated-medical-background"
import TrendAnalysisDashboard from "@/components/trend-analysis-dashboard"
import { loadSubmittedAssessments } from "@/lib/storage"

interface SubmittedAssessment {
  id: string
  employeeId: string
  employeeName: string
  data: any
  submittedAt: string
  status: "submitted" | "draft"
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [submittedAssessments, setSubmittedAssessments] = useState<SubmittedAssessment[]>([])
  const [selectedAssessment, setSelectedAssessment] = useState<SubmittedAssessment | null>(null)
  const [activeTab, setActiveTab] = useState("assessments")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const assessments = loadSubmittedAssessments()
    setSubmittedAssessments(assessments)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const getUniqueEmployees = () => {
    const seen = new Set<string>()
    return submittedAssessments
      .filter((a) => {
        if (seen.has(a.employeeId)) return false
        seen.add(a.employeeId)
        return true
      })
      .map((a) => ({
        id: a.employeeId,
        name: a.employeeName,
        email: a.employeeId,
        assessmentCount: submittedAssessments.filter((x) => x.employeeId === a.employeeId).length,
      }))
  }

  const uniqueEmployees = getUniqueEmployees()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    // <div className="w-full bg-gradient-to-r from-[#004aad] via-[#0077ff] to-[#00c6ff] dark:from-[#002d6a] dark:via-[#004099] dark:to-[#0052cc] animate-gradient-slow">
      <div className="w-full bg-white">
      {/* Header */}
      <header className="relative shadow-md">
        {/* <div className="w-full bg-gradient-to-r from-[#004aad] via-[#0077ff] to-[#00c6ff] dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 transition-colors"> */}
        <div className="w-full bg-gradient-to-r from-[#004aad] via-[#0077ff] to-[#00c6ff] dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 transition-colors">
          <div className="w-full flex items-center justify-between gap-6 text-white px-4 py-4">
            <div className="flex items-center gap-6">
              <div>
                <Image src="/white-logo.png" alt="Logo" width={300} height={300} className="object-contain" />
              </div>

              <div className="space-y-2 leading-tight">
              <p className="text-3xl font-semibold">
                Mapping Lifestyle Patterns in Obesity & Diabetes
              </p>

              <p className="text-lg font-light opacity-90">
                Principal Investigator:{" "}
                <span className="font-medium">Dr. Supriya Bhalerao</span>
              </p>
            </div>
          </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-sm opacity-90">Admin: {user?.name}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="mt-2 bg-white text-blue-600 hover:bg-slate-100"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative min-h-screen w-full overflow-hidden pb-10">
        <AnimatedMedicalBackground />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10">
        {/* <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 shadow-xl transition-colors"> */}
         <Card className="bg-blue-99/60 border-blue-300 shadow-lg backdrop-blur-sm">
          <CardHeader className="border-b border-blue-100 bg-blue-50/60">
          {/* <CardHeader className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-850 transition-colors"> */}
              <CardTitle className="text-2xl text-slate-900">Admin Dashboard</CardTitle>
              <CardDescription className="text-slate-600">
                Manage employees and view their health assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 bg-slate-100 dark:bg-gray-700 p-1 transition-colors">
                  {/* <TabsTrigger
                    value="assessments"
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                  >
                    Assessments ({submittedAssessments.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="employees"
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                  >
                    Employees ({uniqueEmployees.length})
                  </TabsTrigger> */}
                  <TabsTrigger
                    value="trends"
                    className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
                  >
                    Trend Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="assessments" className="space-y-4 mt-6">
                  {submittedAssessments.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <p>Check the assessments submitted</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submittedAssessments.map((assessment) => (
                        <Card
                          key={assessment.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => setSelectedAssessment(assessment)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{assessment.employeeName}</CardTitle>
                                <CardDescription className="text-xs">
                                  ID: {assessment.id.substring(0, 20)}...
                                </CardDescription>
                              </div>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {assessment.status}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded">
                                <p className="text-xs text-slate-600 dark:text-slate-300">Age</p>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {assessment.data.basicInfo?.age || "N/A"}
                                </p>
                              </div>
                              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded">
                                <p className="text-xs text-slate-600 dark:text-slate-300">BMI</p>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {assessment.data.clinicalAssessment?.bmi || "N/A"}
                                </p>
                              </div>
                              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded">
                                <p className="text-xs text-slate-600 dark:text-slate-300">Glucose</p>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {assessment.data.clinicalAssessment?.bloodGlucose || "N/A"}
                                </p>
                              </div>
                              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded">
                                <p className="text-xs text-slate-600 dark:text-slate-300">Submitted</p>
                                <p className="font-semibold text-slate-900 dark:text-white text-xs">
                                  {new Date(assessment.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="mt-3 w-full md:w-auto"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedAssessment(assessment)
                              }}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {selectedAssessment && (
                    <Card className="mt-6 border-blue-200 bg-blue-50">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{selectedAssessment.employeeName} - Detailed Assessment</CardTitle>
                            <CardDescription>Assessment ID: {selectedAssessment.id}</CardDescription>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setSelectedAssessment(null)}>
                            Close
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Basic Info */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Basic Information - All Fields</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(selectedAssessment.data.basicInfo || {}).map(
                              ([key, value]: [string, any]) => {
                                let displayVal: any = value
                                if (value === null || value === "" || value === undefined) {
                                  displayVal = <span className="text-red-500">null</span>
                                } else if (typeof value === "object") {
                                  displayVal = JSON.stringify(value)
                                }

                                return (
                                  <div key={key} className="bg-white p-3 rounded border border-slate-200">
                                    <p className="text-xs text-slate-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1")}
                                    </p>
                                    <p className="font-semibold text-slate-900 text-sm">{displayVal}</p>
                                  </div>
                                )
                              },
                            )}
                          </div>
                        </div>

                        {/* Clinical Assessment */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Clinical Assessment - All Fields</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(selectedAssessment.data.clinicalAssessment || {}).map(
                              ([key, value]: [string, any]) => {
                                let displayVal: any = value
                                if (value === null || value === "" || value === undefined) {
                                  displayVal = <span className="text-red-500">null</span>
                                } else if (typeof value === "object") {
                                  displayVal = JSON.stringify(value)
                                }

                                return (
                                  <div key={key} className="bg-white p-3 rounded border border-slate-200">
                                    <p className="text-xs text-slate-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1")}
                                    </p>
                                    <p className="font-semibold text-slate-900 text-sm">{displayVal}</p>
                                  </div>
                                )
                              },
                            )}
                          </div>
                        </div>

                        {/* Lifestyle */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Lifestyle - All Fields</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(selectedAssessment.data.lifestyle || {}).map(
                              ([key, value]: [string, any]) => {
                                let displayVal: any = value
                                if (value === null || value === "" || value === undefined) {
                                  displayVal = <span className="text-red-500">null</span>
                                } else if (typeof value === "object" && !Array.isArray(value)) {
                                  displayVal = JSON.stringify(value)
                                } else if (Array.isArray(value)) {
                                  displayVal = value.join(", ")
                                }

                                return (
                                  <div key={key} className="bg-white p-3 rounded border border-slate-200">
                                    <p className="text-xs text-slate-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1")}
                                    </p>
                                    <p className="font-semibold text-slate-900 text-sm">{displayVal}</p>
                                  </div>
                                )
                              },
                            )}
                          </div>
                        </div>

                        {/* Biochemical */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Biochemical - All Fields</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(selectedAssessment.data.biochemical || {}).map(
                              ([key, value]: [string, any]) => {
                                let displayVal: any = value
                                if (value === null || value === "" || value === undefined) {
                                  displayVal = <span className="text-red-500">null</span>
                                } else if (typeof value === "object") {
                                  displayVal = JSON.stringify(value)
                                }

                                return (
                                  <div key={key} className="bg-white p-3 rounded border border-slate-200">
                                    <p className="text-xs text-slate-600 capitalize">
                                      {key.replace(/([A-Z])/g, " $1")}
                                    </p>
                                    <p className="font-semibold text-slate-900 text-sm">{displayVal}</p>
                                  </div>
                                )
                              },
                            )}
                          </div>
                        </div>

                        {/* IDRS */}
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">IDRS Screening - All Fields</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(selectedAssessment.data.idrs || {}).map(([key, value]: [string, any]) => {
                              let displayVal: any = value
                              if (value === null || value === "" || value === undefined) {
                                displayVal = <span className="text-red-500">null</span>
                              } else if (typeof value === "object") {
                                displayVal = JSON.stringify(value)
                              }

                              return (
                                <div key={key} className="bg-white p-3 rounded border border-slate-200">
                                  <p className="text-xs text-slate-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                                  <p className="font-semibold text-slate-900 text-sm">{displayVal}</p>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Employees Tab */}
                <TabsContent value="employees" className="space-y-4 mt-6">
                  {uniqueEmployees.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <p>No employees with assessments yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {uniqueEmployees.map((employee) => (
                        <Card key={employee.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{employee.name}</CardTitle>
                            <CardDescription className="text-xs">{employee.id}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3 text-sm">
                              <p className="text-slate-600">
                                <span className="font-medium">Assessments:</span> {employee.assessmentCount}
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full bg-transparent"
                                onClick={() => {
                                  setActiveTab("assessments")
                                }}
                              >
                                View Assessments
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="trends" className="mt-6">
                  <TrendAnalysisDashboard />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}


// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from 'next/navigation'
// import { useAuth } from "@/hooks/use-auth"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import Image from "next/image"
// import AnimatedMedicalBackground from "@/components/animated-medical-background"
// import TrendAnalysisDashboard from "@/components/trend-analysis-dashboard"
// import { loadSubmittedAssessments, getEmployeeAssessments } from "@/lib/storage"

// interface SubmittedAssessment {
//   id: string
//   employeeId: string
//   employeeName: string
//   data: any
//   submittedAt: string
//   status: 'submitted' | 'draft'
// }

// export default function AdminDashboard() {
//   const router = useRouter()
//   const { user, isLoading, logout } = useAuth()
//   const [submittedAssessments, setSubmittedAssessments] = useState<SubmittedAssessment[]>([])
//   const [selectedAssessment, setSelectedAssessment] = useState<SubmittedAssessment | null>(null)
//   const [activeTab, setActiveTab] = useState("assessments")

//   useEffect(() => {
//     if (!isLoading && (!user || user.role !== 'admin')) {
//       router.push("/login")
//     }
//   }, [user, isLoading, router])

//   useEffect(() => {
//     const assessments = loadSubmittedAssessments()
//     setSubmittedAssessments(assessments)
//   }, [])

//   const handleLogout = () => {
//     logout()
//     router.push("/login")
//   }

//   const getUniqueEmployees = () => {
//     const seen = new Set<string>()
//     return submittedAssessments
//       .filter(a => {
//         if (seen.has(a.employeeId)) return false
//         seen.add(a.employeeId)
//         return true
//       })
//       .map(a => ({
//         id: a.employeeId,
//         name: a.employeeName,
//         email: a.employeeId,
//         assessmentCount: submittedAssessments.filter(x => x.employeeId === a.employeeId).length
//       }))
//   }

//   const uniqueEmployees = getUniqueEmployees()

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-slate-600">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="w-full bg-gradient-to-r from-[#004aad] via-[#0077ff] to-[#00c6ff] dark:from-[#002d6a] dark:via-[#004099] dark:to-[#0052cc] animate-gradient-slow">
//       {/* Header */}
//       <header className="relative shadow-md">
//         <div className="w-full bg-gradient-to-r from-[#004aad] via-[#0077ff] to-[#00c6ff] dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 transition-colors">
//           <div className="w-full flex items-center justify-between gap-6 text-white px-4 py-4">
//             <div className="flex items-center gap-6">
//               <div>
//                 <Image
//                   src="/white-logo.png"
//                   alt="Logo"
//                   width={300}
//                   height={300}
//                   className="object-contain"
//                 />
//               </div>

//               <div className="ml-23 space-y-3 leading-tight">
//                 <p className="text-3xl font-semibold">
//                   Mapping Lifestyle Patterns in Obesity & Diabetes
//                 </p>

//                 <p className="text-lg font-light opacity-90">
//                   Principal Investigator: <span className="font-large">Dr. Supriya Bhalerao</span>
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col items-end gap-2">
//               <span className="text-sm opacity-90">Admin: {user?.name}</span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleLogout}
//                 className="mt-2 bg-white text-blue-600 hover:bg-slate-100"
//               >
//                 Logout
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="relative min-h-screen w-full overflow-hidden pb-8">
//         <AnimatedMedicalBackground />
//         <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
//           <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 shadow-lg transition-colors">
//             <CardHeader className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-850 transition-colors">
//               <CardTitle className="text-2xl text-slate-900">Admin Dashboard</CardTitle>
//               <CardDescription className="text-slate-600">
//                 Manage employees and view their health assessments
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="p-6">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                 <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-gray-700 p-1 transition-colors">
//                   <TabsTrigger
//                     value="assessments"
//                     className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
//                   >
//                     Assessments ({submittedAssessments.length})
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="employees"
//                     className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
//                   >
//                     Employees ({uniqueEmployees.length})
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="trends"
//                     className="data-[state=active]:bg-white data-[state=active]:text-slate-900"
//                   >
//                     Trend Analysis
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="assessments" className="space-y-4 mt-6">
//                   {submittedAssessments.length === 0 ? (
//                     <div className="text-center py-12 text-slate-500">
//                       <p>No assessments submitted yet</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {submittedAssessments.map((assessment) => (
//                         <Card
//                           key={assessment.id}
//                           className="cursor-pointer hover:shadow-md transition-shadow"
//                           onClick={() => setSelectedAssessment(assessment)}
//                         >
//                           <CardHeader className="pb-3">
//                             <div className="flex justify-between items-start">
//                               <div>
//                                 <CardTitle className="text-lg">{assessment.employeeName}</CardTitle>
//                                 <CardDescription className="text-xs">
//                                   ID: {assessment.id.substring(0, 20)}...
//                                 </CardDescription>
//                               </div>
//                               <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                                 {assessment.status}
//                               </span>
//                             </div>
//                           </CardHeader>
//                           <CardContent>
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                               <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded">
//                                 <p className="text-xs text-slate-600 dark:text-slate-300">Age</p>
//                                 <p className="font-semibold text-slate-900 dark:text-white">
//                                   {assessment.data.basicInfo?.age || 'N/A'}
//                                 </p>
//                               </div>
//                               <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded">
//                                 <p className="text-xs text-slate-600 dark:text-slate-300">BMI</p>
//                                 <p className="font-semibold text-slate-900 dark:text-white">
//                                   {assessment.data.clinicalAssessment?.bmi || 'N/A'}
//                                 </p>
//                               </div>
//                               <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded">
//                                 <p className="text-xs text-slate-600 dark:text-slate-300">Glucose</p>
//                                 <p className="font-semibold text-slate-900 dark:text-white">
//                                   {assessment.data.clinicalAssessment?.bloodGlucose || 'N/A'}
//                                 </p>
//                               </div>
//                               <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded">
//                                 <p className="text-xs text-slate-600 dark:text-slate-300">Submitted</p>
//                                 <p className="font-semibold text-slate-900 dark:text-white text-xs">
//                                   {new Date(assessment.submittedAt).toLocaleDateString()}
//                                 </p>
//                               </div>
//                             </div>
//                             <Button 
//                               size="sm" 
//                               className="mt-3 w-full md:w-auto"
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 setSelectedAssessment(assessment)
//                               }}
//                             >
//                               View Details
//                             </Button>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                   )}

//                   {selectedAssessment && (
//                     <Card className="mt-6 border-blue-200 bg-blue-50">
//                       <CardHeader>
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <CardTitle>{selectedAssessment.employeeName} - Detailed Assessment</CardTitle>
//                             <CardDescription>Assessment ID: {selectedAssessment.id}</CardDescription>
//                           </div>
//                           <Button 
//                             variant="outline" 
//                             size="sm"
//                             onClick={() => setSelectedAssessment(null)}
//                           >
//                             Close
//                           </Button>
//                         </div>
//                       </CardHeader>
//                       <CardContent className="space-y-6">
//                         {/* Basic Info */}
//                         <div>
//                           <h4 className="font-semibold text-slate-900 mb-3">Basic Information</h4>
//                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                             {Object.entries(selectedAssessment.data.basicInfo || {}).map(([key, value]: [string, any]) => (
//                               <div key={key} className="bg-white p-3 rounded border border-slate-200">
//                                 <p className="text-xs text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
//                                 <p className="font-semibold text-slate-900">
//                                   {value === null || value === '' ? <span className="text-red-500">null</span> : value}
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Clinical Assessment */}
//                         <div>
//                           <h4 className="font-semibold text-slate-900 mb-3">Clinical Assessment</h4>
//                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                             {Object.entries(selectedAssessment.data.clinicalAssessment || {}).map(([key, value]: [string, any]) => (
//                               <div key={key} className="bg-white p-3 rounded border border-slate-200">
//                                 <p className="text-xs text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
//                                 <p className="font-semibold text-slate-900">
//                                   {value === null || value === '' ? <span className="text-red-500">null</span> : value}
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Lifestyle */}
//                         <div>
//                           <h4 className="font-semibold text-slate-900 mb-3">Lifestyle</h4>
//                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                             {Object.entries(selectedAssessment.data.lifestyle || {}).map(([key, value]: [string, any]) => (
//                               <div key={key} className="bg-white p-3 rounded border border-slate-200">
//                                 <p className="text-xs text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
//                                 <p className="font-semibold text-slate-900">
//                                   {value === null || value === '' ? <span className="text-red-500">null</span> : value}
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* IDRS */}
//                         <div>
//                           <h4 className="font-semibold text-slate-900 mb-3">IDRS Screening</h4>
//                           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                             {Object.entries(selectedAssessment.data.idrs || {}).map(([key, value]: [string, any]) => (
//                               <div key={key} className="bg-white p-3 rounded border border-slate-200">
//                                 <p className="text-xs text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
//                                 <p className="font-semibold text-slate-900">
//                                   {value === null || value === '' ? <span className="text-red-500">null</span> : value}
//                                 </p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )}
//                 </TabsContent>

//                 {/* Employees Tab */}
//                 <TabsContent value="employees" className="space-y-4 mt-6">
//                   {uniqueEmployees.length === 0 ? (
//                     <div className="text-center py-12 text-slate-500">
//                       <p>No employees with assessments yet</p>
//                     </div>
//                   ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                       {uniqueEmployees.map((employee) => (
//                         <Card key={employee.id} className="hover:shadow-md transition-shadow">
//                           <CardHeader className="pb-3">
//                             <CardTitle className="text-lg">{employee.name}</CardTitle>
//                             <CardDescription className="text-xs">{employee.id}</CardDescription>
//                           </CardHeader>
//                           <CardContent>
//                             <div className="space-y-3 text-sm">
//                               <p className="text-slate-600">
//                                 <span className="font-medium">Assessments:</span> {employee.assessmentCount}
//                               </p>
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 className="w-full"
//                                 onClick={() => {
//                                   setActiveTab("assessments")
//                                 }}
//                               >
//                                 View Assessments
//                               </Button>
//                             </div>
//                           </CardContent>
//                         </Card>
//                       ))}
//                     </div>
//                   )}
//                 </TabsContent>

//                 <TabsContent value="trends" className="mt-6">
//                   <TrendAnalysisDashboard />
//                 </TabsContent>
//               </Tabs>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }
