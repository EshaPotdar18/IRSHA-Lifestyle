"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BasicInfoForm from "@/components/forms/basic-info-form"
import ClinicalAssessmentForm from "@/components/forms/clinical-assessment-form"
import LifestyleForm from "@/components/forms/lifestyle-form"
import IDRSForm from "@/components/forms/idrs-form"
import BiochemicalForm from "@/components/forms/biochemicals-form"
import SummaryDashboard from "@/components/summary-dashboard"
import Image from "next/image"
import { saveAssessmentData, loadAssessmentData, clearAssessmentData } from "@/lib/storage"
import AnimatedMedicalBackground from "@/components/animated-medical-background"

export default function EmployeeDashboard() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [formData, setFormData] = useState({
    basicInfo: {},
    clinicalAssessment: {},
    lifestyle: {},
    idrs: {},
    biochemical: {},
  })
  const [currentTab, setCurrentTab] = useState("basic")
  const [showSummary, setShowSummary] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "employee")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const savedData = loadAssessmentData()
    if (savedData) {
      setFormData({
        basicInfo: savedData.basicInfo || {},
        clinicalAssessment: savedData.clinicalAssessment || {},
        lifestyle: savedData.lifestyle || {},
        idrs: savedData.idrs || {},
        biochemical: savedData.biochemical || {},
      })
    }
    setIsLoadingData(false)
  }, [])

  useEffect(() => {
    if (!isLoadingData) {
      saveAssessmentData(formData)
    }
  }, [formData, isLoadingData])

  const handleFormUpdate = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  const handleSubmit = () => {
    setShowSummary(true)
  }

  const handleNewAssessment = () => {
    if (confirm("Are you sure you want to start a new assessment? Current data will be cleared.")) {
      clearAssessmentData()
      setFormData({
        basicInfo: {},
        clinicalAssessment: {},
        lifestyle: {},
        idrs: {},
        biochemical: {},
      })
      setCurrentTab("basic")
      setShowSummary(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (showSummary) {
    return (
      <SummaryDashboard data={formData} onEdit={() => setShowSummary(false)} onNewAssessment={handleNewAssessment} />
    )
  }

    return (
    <div className="w-full bg-gradient-to-r from-[#004aad] via-[#0077ff] to-[#00c6ff] dark:from-[#002d6a] dark:via-[#004099] dark:to-[#0052cc] animate-gradient-slow">
      {/* Header */}
      <header className="relative shadow-md">
        <div className="w-full bg-gradient-to-r from-[#004aad] via-[#0077ff] to-[#00c6ff] dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 transition-colors">
          <div className="w-full flex items-center justify-between gap-6 text-white px-4 py-4">
            <div className="flex items-center gap-6">
              <div>
                <Image
                  src="/white-logo.png"
                  alt="Logo"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>

              <div className="ml-23 space-y-3 leading-tight">
                <p className="text-3xl font-semibold">
                  Mapping Lifestyle Patterns in Obesity & Diabetes
                </p>

                <p className="text-lg font-light opacity-90">
                  Principal Investigator: <span className="font-large">Dr. Supriya Bhalerao</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className="text-sm opacity-90">Welcome, {user?.name}</span>
              <span className="text-xs opacity-75">{user?.employeeId}</span>
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
      <main className="relative min-h-screen w-full overflow-hidden">
        <AnimatedMedicalBackground />
        <Card className="bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 shadow-lg transition-colors">
          <CardHeader className="border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-850 transition-colors">
            <CardTitle className="text-2xl text-slate-900">Health Assessment Form</CardTitle>
            <CardDescription className="text-slate-600">
              Complete all sections to generate a comprehensive health profile
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 gap-2 bg-slate-100 dark:bg-gray-700 p-1 transition-colors">
                <TabsTrigger
                  value="basic"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="clinical"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Clinical
                </TabsTrigger>
                <TabsTrigger
                  value="lifestyle"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  Lifestyle
                </TabsTrigger>

                <TabsTrigger
                  value="idrs"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  IDRS
                </TabsTrigger>

                <TabsTrigger
                  value="biochemical"
                  className="text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-900"
                >
                  BioChemical
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="basic" className="space-y-6">
                  <BasicInfoForm data={formData.basicInfo} onUpdate={(data) => handleFormUpdate("basicInfo", data)} />
                </TabsContent>

                <TabsContent value="clinical" className="space-y-6">
                  <ClinicalAssessmentForm
                    data={formData.clinicalAssessment}
                    onUpdate={(data) => handleFormUpdate("clinicalAssessment", data)}
                  />
                </TabsContent>

                <TabsContent value="lifestyle" className="space-y-6">
                  <LifestyleForm data={formData.lifestyle} onUpdate={(data) => handleFormUpdate("lifestyle", data)} />
                </TabsContent>

                <TabsContent value="idrs" className="space-y-6">
                  <IDRSForm
                    data={formData.idrs}
                    onUpdate={(data) => handleFormUpdate("idrs", data)}
                  />
                </TabsContent>

                <TabsContent value="biochemical" className="space-y-6">
                  <BiochemicalForm
                    data={formData.biochemical}
                    onUpdate={(data) => handleFormUpdate("biochemical", data)}
                  />
                </TabsContent>
              </div>
            </Tabs>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between border-t border-slate-200 pt-6">
              <Button
                variant="outline"
                onClick={() => {
                  const tabs = ["basic", "clinical", "lifestyle", "idrs", "biochemical"]
                  const currentIndex = tabs.indexOf(currentTab)
                  if (currentIndex > 0) {
                    setCurrentTab(tabs[currentIndex - 1])
                  }
                }}
                disabled={currentTab === "basic"}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Previous
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const tabs = ["basic", "clinical", "lifestyle", "idrs", "biochemical"]
                    const currentIndex = tabs.indexOf(currentTab)
                    if (currentIndex < tabs.length - 1) {
                      setCurrentTab(tabs[currentIndex + 1])
                    }
                  }}
                  disabled={currentTab === "biochemical"}
                  className="border-slate-300 dark:border-gray-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Next
                </Button>
                {currentTab === "biochemical" && (
                  <Button onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700">
                    Review & Submit
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
