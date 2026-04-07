"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import BasicInfoForm from "@/components/forms/basic-info-form"
import ClinicalAssessmentForm from "@/components/forms/clinical-assessment-form"
import LifestyleForm from "@/components/forms/lifestyle-form"
import IDRSForm from "@/components/forms/idrs-form"
import BiochemicalForm from "@/components/forms/biochemicals-form"
import SummaryDashboard from "@/components/summary-dashboard"

import Image from "next/image"
import AnimatedMedicalBackground from "@/components/animated-medical-background"

import {
  saveAssessmentData,
  loadAssessmentData,
  clearAssessmentData,
  loadSubmittedAssessments,
  updateMasterCSVData,
} from "@/lib/storage"

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

/* -------------------- DEFAULT DATA SHAPES (CRITICAL FIX) -------------------- */

const BASIC_INFO_DEFAULT = {
  name: null,
  age: null,
  gender: null,
  height: null,
  weight: null,
  bmi: null,
}

const CLINICAL_DEFAULT = {
}

const LIFESTYLE_DEFAULT = {
  physicalActivity: null,
  sleepHours: null,
  smoking: null,
  alcohol: null,
}

const IDRS_DEFAULT = {
  gender: null,
  age: null,
  abdominalObesity: null,
  physicalActivity: null,
  familyHistoryDiabetes: null,
  totalScore: null,
}

const BIOCHEMICAL_DEFAULT = {
  values: {},
  flags: {},
  prakriti: {},
}

/* -------------------------------------------------------------------------- */

export default function Page() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  const [formData, setFormData] = useState({
    basicInfo: BASIC_INFO_DEFAULT,
    clinicalAssessment: CLINICAL_DEFAULT,
    lifestyle: LIFESTYLE_DEFAULT,
    idrs: IDRS_DEFAULT,
    biochemical: BIOCHEMICAL_DEFAULT,
  })

useEffect(() => {
  if (!user || isLoading) return

  const saveDraft = async () => {
    try {
      await fetch("/api/assessments/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          assessment: formData,
        }),
      })
    } catch (err) {
      console.error("Draft autosave failed", err)
    }
  }

  saveDraft()
}, [formData, user, isLoading])



  const [currentTab, setCurrentTab] = useState("basic")
  const [showSummary, setShowSummary] = useState(false)

  const tabsOrder = ["basic", "clinical", "lifestyle", "idrs", "biochemical"]

  /* -------------------- AUTH HANDLING -------------------- */

  useEffect(() => {
    if (!isLoading && !user) router.push("/login")
  }, [user, isLoading, router])

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin") router.push("/dashboard/admin")
      if (user.role === "employee") router.push("/dashboard/employee")
    }
  }, [user, isLoading, router])

  /* -------------------- LOAD SAVED FORM DATA -------------------- */

  useEffect(() => {
    const saved = loadAssessmentData()
    if (saved) {
      setFormData({
        basicInfo: { ...BASIC_INFO_DEFAULT, ...saved.basicInfo },
        clinicalAssessment: { ...CLINICAL_DEFAULT, ...saved.clinicalAssessment },
        lifestyle: { ...LIFESTYLE_DEFAULT, ...saved.lifestyle },
        idrs: { ...IDRS_DEFAULT, ...saved.idrs },
        biochemical: { ...BIOCHEMICAL_DEFAULT, ...saved.biochemical },
      })
    }
  }, [])

  /* -------------------- AUTO SAVE -------------------- */

  // useEffect(() => {
  //   if (!isLoading) saveAssessmentData(formData)
  // }, [formData, isLoading])

  const handleFormUpdate = (section: keyof typeof formData, data: any) => {
    setFormData(prev => ({ ...prev, [section]: data }))
  }

  const handleSubmit = () => setShowSummary(true)

  const handleNewAssessment = () => {
    if (!confirm("Start a new assessment? Current data will be saved.")) return

    if (user && formData.basicInfo.name) {
      const assessment = {
        id: `ASS-${Date.now()}`,
        employeeId: user.id ?? "unknown",
        employeeName: user.name ?? "Unknown",
        data: formData,
        submittedAt: new Date().toISOString(),
        status: "draft" as const,
      }

      const submitted = loadSubmittedAssessments()
      submitted.push(assessment)
      localStorage.setItem("submitted_assessments", JSON.stringify(submitted))
      updateMasterCSVData(assessment)
    }

    clearAssessmentData()
    setFormData({
      basicInfo: BASIC_INFO_DEFAULT,
      clinicalAssessment: CLINICAL_DEFAULT,
      lifestyle: LIFESTYLE_DEFAULT,
      idrs: IDRS_DEFAULT,
      biochemical: BIOCHEMICAL_DEFAULT,
    })
    setCurrentTab("basic")
    setShowSummary(false)
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-blue-600" />
      </div>
    )
  }

  if (showSummary) {
    return (
      <SummaryDashboard
        data={formData}
        onEdit={() => setShowSummary(false)}
        onNewAssessment={handleNewAssessment}
      />
    )
  }

  /* -------------------- UI (UNCHANGED) -------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <header className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <Image src="/white-logo.png" alt="Logo" width={260} height={80} />
      </header>

      <main className="p-6">
        <AnimatedMedicalBackground />

        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle>Health Assessment Form</CardTitle>
            <CardDescription>Complete all sections</CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="clinical">Clinical</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                <TabsTrigger value="idrs">IDRS</TabsTrigger>
                <TabsTrigger value="biochemical">Biochemical</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicInfoForm data={formData.basicInfo} onUpdate={d => handleFormUpdate("basicInfo", d)} />
              </TabsContent>

              <TabsContent value="clinical">
                <ClinicalAssessmentForm
                  data={formData.clinicalAssessment}
                  onUpdate={d => handleFormUpdate("clinicalAssessment", d)}
                />
              </TabsContent>

              <TabsContent value="lifestyle">
                <LifestyleForm data={formData.lifestyle} onUpdate={d => handleFormUpdate("lifestyle", d)} />
              </TabsContent>

              <TabsContent value="idrs">
                <IDRSForm data={formData.idrs} onUpdate={d => handleFormUpdate("idrs", d)} />
              </TabsContent>

              <TabsContent value="biochemical">
                <BiochemicalForm data={formData.biochemical} onUpdate={d => handleFormUpdate("biochemical", d)} />
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-6">
              <Button
                disabled={currentTab === tabsOrder[0]}
                onClick={() =>
                  setCurrentTab(tabsOrder[tabsOrder.indexOf(currentTab) - 1])
                }
              >
                Previous
              </Button>

              <Button
                disabled={currentTab !== "biochemical"}
                onClick={handleSubmit}
              >
                Review & Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}


// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
// import BasicInfoForm from "@/components/forms/basic-info-form"
// import ClinicalAssessmentForm from "@/components/forms/clinical-assessment-form"
// import LifestyleForm from "@/components/forms/lifestyle-form"
// import BiochemicalForm from "@/components/forms/biochemicals-form"
// import IDRSForm from "@/components/forms/idrs-form"
// import SummaryDashboard from "@/components/summary-dashboard"

// import Image from "next/image"
// import { saveAssessmentData, loadAssessmentData, clearAssessmentData } from "@/lib/storage"
// import AnimatedMedicalBackground from "@/components/animated-medical-background"
// import { useRouter } from "next/navigation"
// import { useAuth } from "@/hooks/use-auth"
// import { loadSubmittedAssessments, updateMasterCSVData } from "@/lib/storage"

// export default function Page() {
//   const router = useRouter()
//   const { user, isLoading } = useAuth()

//   const [formData, setFormData] = useState({
//     basicInfo: {},
//     clinicalAssessment: {},
//     lifestyle: {},
//     idrs: {},
//     biochemical: {},
//   })
//   const [currentTab, setCurrentTab] = useState("basic")
//   const [showSummary, setShowSummary] = useState(false)

//   const tabsOrder = ["basic", "clinical", "lifestyle", "idrs", "biochemical"]

//   useEffect(() => {
//     if (!isLoading && !user) router.push("/login")
//   }, [user, isLoading, router])

//   useEffect(() => {
//     if (!isLoading && user) {
//       if (user.role === "admin") router.push("/dashboard/admin")
//       if (user.role === "employee") router.push("/dashboard/employee")
//     }
//   }, [user, isLoading, router])

//   // Load saved data
//   useEffect(() => {
//     const saved = loadAssessmentData()
//     if (saved) {
//       setFormData({
//         basicInfo: saved.basicInfo || {},
//         clinicalAssessment: saved.clinicalAssessment || {},
//         lifestyle: saved.lifestyle || {},
//         idrs: saved.idrs || {},
//         biochemical: saved.biochemical || {},
//       })
//     }
//   }, [])

//   useEffect(() => {
//     if (!isLoading) saveAssessmentData(formData)
//   }, [formData, isLoading])

//   const handleFormUpdate = (section: string, data: any) => {
//     setFormData((prev) => ({ ...prev, [section]: data }))
//   }

//   const handleSubmit = () => setShowSummary(true)
//   const handleNewAssessment = () => {
//     if (confirm("Start a new assessment? Current data will be saved and cleared from the form.")) {
//       // Auto-save current assessment before clearing
//       if (user && Object.keys(formData.basicInfo).length > 0) {
//         try {
//           const assessmentId = `ASS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
//           const newAssessment = {
//             id: assessmentId,
//             employeeId: user.id || "unknown",
//             employeeName: user.name || "Unknown",
//             data: formData,
//             submittedAt: new Date().toISOString(),
//             status: "draft" as const,
//           }

//           const submitted = loadSubmittedAssessments()
//           submitted.push(newAssessment)
//           localStorage.setItem("submitted_assessments", JSON.stringify(submitted))

//           // Also add to master CSV
//           updateMasterCSVData(newAssessment)
//         } catch (error) {
//           console.error("Error auto-saving assessment:", error)
//         }
//       }

//       clearAssessmentData()
//       setFormData({
//         basicInfo: {},
//         clinicalAssessment: {},
//         lifestyle: {},
//         idrs: {},
//         biochemical: {},
//       })
//       setCurrentTab("basic")
//       setShowSummary(false)
//     }
//   }

//   if (isLoading || !user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
//         <div className="text-center p-8 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-2xl border border-white/20">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//           <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading assessment...</p>
//         </div>
//       </div>
//     )
//   }

//   if (showSummary) {
//     return (
//       <SummaryDashboard data={formData} onEdit={() => setShowSummary(false)} onNewAssessment={handleNewAssessment} />
//     )
//   }

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 relative overflow-hidden">
//       {/* Subtle overlay for depth */}
//       <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20"></div>
//       <header className="relative z-10 shadow-2xl border-b border-white/10">
//         <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center gap-6 text-white px-4 py-6 backdrop-blur-sm bg-opacity-95">
//           <div className="pl-4">
//             <Image
//               src="/white-logo.png"
//               alt="Logo"
//               width={300}
//               height={300}
//               className="object-contain drop-shadow-lg"
//             />
//           </div>
//           <div className="ml-6 space-y-2 leading-tight">
//             <p className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
//               Mapping Lifestyle Patterns in Obesity & Diabetes
//             </p>
//             <p className="text-lg font-light opacity-90">
//               Principal Investigator: <span className="font-semibold text-blue-100">Dr. Supriya Bhalerao</span>
//             </p>
//           </div>
//         </div>
//       </header>

//       <main className="relative z-10 min-h-screen w-full overflow-hidden px-4 py-8">
//         <AnimatedMedicalBackground className="absolute inset-0 opacity-20" />

//         <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl max-w-6xl mx-auto">
//           <CardHeader className="border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 via-indigo-50/50 to-purple-50/50 dark:from-gray-800/50 dark:via-gray-700/50 dark:to-gray-600/50 rounded-t-3xl">
//             <CardTitle className="text-3xl text-gray-900 dark:text-gray-100 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Health Assessment Form
//             </CardTitle>
//             <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
//               Complete all sections to generate a comprehensive health profile
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="p-8">
//             <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
//               <TabsList className="grid w-full grid-cols-5 gap-2 bg-gradient-to-r from-gray-100/80 to-gray-200/80 dark:from-gray-700/80 dark:to-gray-600/80 p-2 rounded-2xl border border-gray-200/30 shadow-inner">
//                 <TabsTrigger
//                   value="basic"
//                   className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-blue-500/50 rounded-xl transition-all duration-200 py-3 font-semibold hover:bg-blue-100 dark:hover:bg-gray-600"
//                 >
//                   Basic Info
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="clinical"
//                   className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-indigo-500/50 rounded-xl transition-all duration-200 py-3 font-semibold hover:bg-indigo-100 dark:hover:bg-gray-600"
//                 >
//                   Clinical
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="lifestyle"
//                   className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-green-500/50 rounded-xl transition-all duration-200 py-3 font-semibold hover:bg-green-100 dark:hover:bg-gray-600"
//                 >
//                   Lifestyle
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="idrs"
//                   className="data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-orange-500/50 rounded-xl transition-all duration-200 py-3 font-semibold hover:bg-orange-100 dark:hover:bg-gray-600"
//                 >
//                   IDRS
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="biochemical"
//                   className="data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-purple-500/50 rounded-xl transition-all duration-200 py-3 font-semibold hover:bg-purple-100 dark:hover:bg-gray-600"
//                 >
//                   BioChemical
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent
//                 value="basic"
//                 className="mt-6 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-750/50 border border-gray-200/20"
//               >
//                 <BasicInfoForm data={formData.basicInfo} onUpdate={(d) => handleFormUpdate("basicInfo", d)} />
//               </TabsContent>
//               <TabsContent
//                 value="clinical"
//                 className="mt-6 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-750/50 border border-gray-200/20"
//               >
//                 <ClinicalAssessmentForm
//                   data={formData.clinicalAssessment}
//                   onUpdate={(d) => handleFormUpdate("clinicalAssessment", d)}
//                 />
//               </TabsContent>
//               <TabsContent
//                 value="lifestyle"
//                 className="mt-6 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-750/50 border border-gray-200/20"
//               >
//                 <LifestyleForm data={formData.lifestyle} onUpdate={(d) => handleFormUpdate("lifestyle", d)} />
//               </TabsContent>
//               <TabsContent
//                 value="idrs"
//                 className="mt-6 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-750/50 border border-gray-200/20"
//               >
//                 <IDRSForm data={formData.idrs} onUpdate={(d) => handleFormUpdate("idrs", d)} />
//               </TabsContent>
//               <TabsContent
//                 value="biochemical"
//                 className="mt-6 rounded-2xl p-6 bg-gray-50/50 dark:bg-gray-750/50 border border-gray-200/20"
//               >
//                 <BiochemicalForm data={formData.biochemical} onUpdate={(d) => handleFormUpdate("biochemical", d)} />
//               </TabsContent>
//             </Tabs>

//             {/* Navigation Buttons */}
//             <div className="mt-10 flex justify-between items-center border-t border-gray-200/30 pt-8 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-gray-800/50 rounded-b-3xl">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   const index = tabsOrder.indexOf(currentTab)
//                   if (index > 0) setCurrentTab(tabsOrder[index - 1])
//                 }}
//                 disabled={currentTab === tabsOrder[0]}
//                 className="border-gray-300 hover:border-gray-400 bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
//               >
//                 Previous
//               </Button>

//               <div className="flex gap-4">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     const index = tabsOrder.indexOf(currentTab)
//                     if (index < tabsOrder.length - 1) setCurrentTab(tabsOrder[index + 1])
//                   }}
//                   disabled={currentTab === tabsOrder[tabsOrder.length - 1]}
//                   className="border-gray-300 hover:border-gray-400 bg-white/80 dark:bg-gray-700/80 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl px-6 py-3 font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
//                 >
//                   Next
//                 </Button>

//                 <Button
//                   onClick={handleSubmit}
//                   disabled={currentTab !== "biochemical"}
//                   className={`rounded-xl px-8 py-3 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${currentTab === "biochemical" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700" : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"}`}
//                 >
//                   Review & Submit
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   )
// }
