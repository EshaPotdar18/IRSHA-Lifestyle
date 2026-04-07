"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { calculateTrendAnalysis, exportMasterDataAsCSV, loadMasterCSVData } from "@/lib/storage"
// import { calculateTrendAnalysis } from "@/lib/storage"
import { useEffect, useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, ScatterChart, Scatter,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TrendAnalysisDashboard() {
  const [trends, setTrends] = useState<any>(null)
  const [masterData, setMasterData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const analysis = calculateTrendAnalysis()
  //   setTrends(analysis)
  //   setMasterData(loadMasterCSVData())
  //   setLoading(false)
  // }, [])

useEffect(() => {
  async function load() {
    try {
      const res = await fetch("/api/admin/master-json")
      if (!res.ok) throw new Error("Failed to load master data")
      const data = await res.json()
      setMasterData(data)

      const trendsRes = await fetch("/api/admin/trends")
      if (!trendsRes.ok) throw new Error("Failed to load trends")
      const trendsData = await trendsRes.json()
      setTrends(trendsData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  load()
}, [])



  if (loading || !trends) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Analyzing trends...</p>
      </div>
    )
  }

const bmiDistribution = trends?.bmiDistribution ?? {}

const bmiChartData = Object.entries(bmiDistribution).map(
  ([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  })
)



  const COLORS = ["#3b82f6", "#14b8a6", "#eab308", "#ef4444", "#8b5cf6"]

  const getAgeDistribution = () => {
    const distribution = {
      "18-30": 0,
      "31-40": 0,
      "41-50": 0,
      "51-60": 0,
      "60+": 0,
    }
    masterData.forEach((row) => {
      const age = Number.parseInt(row.basicInfo_age)
      if (!isNaN(age)) {
        if (age < 31) distribution["18-30"]++
        else if (age < 41) distribution["31-40"]++
        else if (age < 51) distribution["41-50"]++
        else if (age < 61) distribution["51-60"]++
        else distribution["60+"]++
      }
    })
    return Object.entries(distribution).map(([risk, count]) => ({
  risk,
  count,
}))


  }

  const getHbA1cDistribution = () => {
    const distribution = {
      Normal: 0,
      Prediabetes: 0,
      Diabetes: 0,
      Unknown: 0,
    }
    masterData.forEach((row) => {
      const hba1c = Number.parseFloat(row.biochemical_values_hba1c || row.biochemical_hba1c)
      if (!isNaN(hba1c)) {
        if (hba1c <= 5.4) distribution.Normal++
        else if (hba1c < 6.5) distribution.Prediabetes++
        else distribution.Diabetes++
      } else {
        distribution.Unknown++
      }
    })
    return Object.entries(distribution).map(([category, count]): { category: string; count: number } => ({
  category,
  count,
}))
  }

  const getGenderDistribution = () => {
    const distribution: Record<string, number> = {
      Male: 0,
      Female: 0,
      Other: 0,
    }
    masterData.forEach((row) => {
      const gender = row.basicInfo_gender
      if (gender === "Male" || gender === "M") distribution.Male++
      else if (gender === "Female" || gender === "F") distribution.Female++
      else if (gender) distribution.Other++
    })
    return Object.entries(distribution)
      .filter(([_, count]) => count > 0)
      .map(([gender, count]): { gender: string; count: number } => ({
        gender,
        count,
      }))
  }

  const getBPDistribution = () => {
    const distribution = {
      Normal: 0,
      Elevated: 0,
      "Stage 1 Hypertension": 0,
      "Stage 2 Hypertension": 0,
      Unknown: 0,
    }
    masterData.forEach((row) => {
      const systolic = Number.parseInt(row.clinicalAssessment_systolicBP)
      if (!isNaN(systolic)) {
        if (systolic < 120) distribution.Normal++
        else if (systolic < 130) distribution.Elevated++
        else if (systolic < 140) distribution["Stage 1 Hypertension"]++
        else distribution["Stage 2 Hypertension"]++
      } else {
        distribution.Unknown++
      }
    })
    return Object.entries(distribution).map(([category, count]): { category: string; count: number } => ({
  category,
  count,
}))
  }

  const getCholesterolDistribution = () => {
    const distribution = {
      Desirable: 0,
      Borderline: 0,
      High: 0,
      Unknown: 0,
    }
    masterData.forEach((row) => {
      const totalChol = Number.parseFloat(row.biochemical_values_totalCholesterol || row.biochemical_totalCholesterol)
      if (!isNaN(totalChol)) {
        if (totalChol < 200) distribution.Desirable++
        else if (totalChol < 240) distribution.Borderline++
        else distribution.High++
      } else {
        distribution.Unknown++
      }
    })
    return Object.entries(distribution).map(([category, count]): { category: string; count: number } => ({
  category,
  count,
}))
  }

  const getIDRSDistribution = () => {
    const distribution = {
      Low: 0,
      Moderate: 0,
      High: 0,
      Unknown: 0,
    }
    masterData.forEach((row) => {
      const idrsScore = Number.parseInt(row.idrs_score)
      if (!isNaN(idrsScore)) {
        if (idrsScore < 30) distribution.Low++
        else if (idrsScore < 60) distribution.Moderate++
        else distribution.High++
      } else {
        distribution.Unknown++
      }
    })
    return Object.entries(distribution).map(([risk, count]) => ({
  risk,
  count,
}))

  }

  const getBMIvsGlucoseData = () => {
    return masterData
      .filter((row) => {
        const bmi = Number.parseFloat(row.clinicalAssessment_bmi)
        const glucose = Number.parseFloat(row.clinicalAssessment_bloodGlucose)
        return !isNaN(bmi) && !isNaN(glucose)
      })
      .map((row) => ({
        bmi: Number.parseFloat(row.clinicalAssessment_bmi),
        glucose: Number.parseFloat(row.clinicalAssessment_bloodGlucose),
      }))
  }

  const getBMIvsBiochemical = (key: string) => {
  return masterData
    .filter(
      (row) =>
        !isNaN(Number.parseFloat(row.clinicalAssessment_bmi)) &&
        !isNaN(Number.parseFloat(row[`biochemical_values_${key}`]))
    )
    .map((row) => ({
      bmi: Number.parseFloat(row.clinicalAssessment_bmi),
      value: Number.parseFloat(row[`biochemical_values_${key}`]),
    }))
}


  
/* -------- Prakriti vs BMI -------- */

const getPrakritiVsBMI = () => {
  return masterData
    .filter(
      (row) =>
        row.biochemical_prakriti_conclusion &&
        !isNaN(Number.parseFloat(row.clinicalAssessment_bmi))
    )
    .map((row) => ({
      prakriti: row.biochemical_prakriti_conclusion,
      bmi: Number.parseFloat(row.clinicalAssessment_bmi),
    }))
}

/* -------- Prakriti vs Biochemical (Averages) -------- */

const getPrakritiVsBiochemical = (key: string) => {
  const map: Record<string, { total: number; count: number }> = {}

  masterData.forEach((row) => {
    const prakriti = row.biochemical_prakriti_conclusion
    const value = Number.parseFloat(row[`biochemical_values_${key}`])
    if (prakriti && !isNaN(value)) {
      if (!map[prakriti]) map[prakriti] = { total: 0, count: 0 }
      map[prakriti].total += value
      map[prakriti].count += 1
    }
  })

  return Object.entries(map).map(([prakriti, obj]) => ({
    prakriti,
    value: Number((obj.total / obj.count).toFixed(2)),
  }))
}

  const getPrakritiDistribution = () => {
    const distribution: Record<string, number> = {}
    masterData.forEach((row) => {
      const prakriti = row.biochemical_prakriti_conclusion
      if (prakriti && prakriti !== "—") {
        distribution[prakriti] = (distribution[prakriti] || 0) + 1
      }
    })
    return Object.entries(distribution).map(([type, count]) => ({
      type,
      count,
    }))
  }

const getTimelineData = () => {
  const timeline: Record<string, number> = {}

  masterData.forEach((row) => {
    const date = new Date(row.submittedAt)
    if (isNaN(date.getTime())) return

    const key = `${date.getFullYear()}-${date.getMonth() + 1}`
    timeline[key] = (timeline[key] || 0) + 1
  })

  return Object.entries(timeline)
    .sort()
    .map(([key, count]) => ({
      date: key,
      count,
    }))
}

  // const ageDistribution = getAgeDistribution()
  const ageDistribution = trends.ageDistribution
  const hba1cDistribution = getHbA1cDistribution()
  const genderDistribution = getGenderDistribution()
  const bpDistribution = getBPDistribution()
  const cholesterolDistribution = getCholesterolDistribution()
  const idrsDistribution: { risk: string; count: number }[] = getIDRSDistribution()
  const bmiGlucoseData = getBMIvsGlucoseData()
  const prakritiDistribution = getPrakritiDistribution()
  const timelineData = getTimelineData()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-700 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{trends.totalAssessments}</div>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">Submitted records</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 shadow-md bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-300">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">{trends.totalEmployees}</div>
            <p className="text-xs text-teal-600 dark:text-teal-300 mt-1">Unique employees</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 shadow-md bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Average Age</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-600 dark:text-amber-400">{trends.averageAge}</div>
            <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">Years</p>
          </CardContent>
        </Card>

        <Card className="border-red-300 dark:border-red-700 shadow-md bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Diabetes Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400">{trends.diabetesRiskCount}</div>
            <p className="text-xs text-red-600 dark:text-red-300 mt-1">High risk individuals</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="demographics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-gray-700">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="clinical">Clinical Metrics</TabsTrigger>
          <TabsTrigger value="biochemical">Biochemical</TabsTrigger>
          <TabsTrigger value="data">Data Export</TabsTrigger>
        </TabsList>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Participant count by age groups</CardDescription>
              </CardHeader>
              <CardContent>
                {ageDistribution.some((d) => d.count > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageDistribution} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="risk" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" name="Count" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Participant breakdown by gender</CardDescription>
              </CardHeader>
              <CardContent>
                {genderDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(d: any) => `${d.gender}: ${d.count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {genderDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>Prakriti Distribution</CardTitle>
                <CardDescription>Ayurvedic constitution types</CardDescription>
              </CardHeader>
              <CardContent>
                {prakritiDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prakritiDistribution} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" name="Count" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>Assessment Timeline</CardTitle>
                <CardDescription>Submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                {timelineData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Clinical Metrics Tab */}
        <TabsContent value="clinical" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>BMI Distribution</CardTitle>
                <CardDescription>Population breakdown by BMI category</CardDescription>
              </CardHeader>
              <CardContent>
                {bmiChartData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={bmiChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(d: any) => `${d.name}: ${d.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bmiChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>Blood Pressure Distribution</CardTitle>
                <CardDescription>Hypertension categories</CardDescription>
              </CardHeader>
              <CardContent>
                {bpDistribution.some((d) => d.count > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bpDistribution} margin={{ top: 5, right: 30, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ef4444" name="Count" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>IDRS Risk Distribution</CardTitle>
                <CardDescription>Diabetes risk assessment categories</CardDescription>
              </CardHeader>
              <CardContent>
                {idrsDistribution.some((d) => d.count > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={idrsDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(d: any) => `${d.risk}: ${d.count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {idrsDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>BMI vs Glucose Correlation</CardTitle>
                <CardDescription>Relationship between BMI and blood glucose levels</CardDescription>
              </CardHeader>
              <CardContent>
                {bmiGlucoseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="bmi" name="BMI" label={{ value: "BMI", position: "insideBottom", offset: -5 }} />
                      <YAxis
                        dataKey="glucose"
                        name="Glucose"
                        label={{ value: "Glucose (mg/dL)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter name="Participants" data={bmiGlucoseData} fill="#14b8a6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader>
              <CardTitle>Blood Glucose Statistics (mg/dL)</CardTitle>
              <CardDescription>Population glucose level metrics for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Average Glucose</span>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {trends.glucoseStats.avg}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-700">
                  <div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Minimum</span>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                      {trends.glucoseStats.min}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-lg border border-red-200 dark:border-red-700">
                  <div>
                    <span className="text-sm font-medium text-red-700 dark:text-red-300">Maximum</span>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{trends.glucoseStats.max}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Biochemical Tab */}
        <TabsContent value="biochemical" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>HbA1c Distribution</CardTitle>
                <CardDescription>Diabetes diagnosis categories</CardDescription>
              </CardHeader>
              <CardContent>
                {hba1cDistribution.some((d) => d.count > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={hba1cDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(d: any) => `${d.category}: ${d.count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {hba1cDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>BMI vs HbA1c</CardTitle>
                <CardDescription>Correlation between BMI and HbA1c</CardDescription>
              </CardHeader>
              <CardContent>
                {getBMIvsBiochemical("hba1c").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bmi" name="BMI" />
                      <YAxis dataKey="value" name="HbA1c" />
                      <Tooltip />
                      <Scatter data={getBMIvsBiochemical("hba1c")} fill="#ef4444" />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>BMI vs totalCholesterol</CardTitle>
                <CardDescription>Correlation between BMI and totalCholesterol</CardDescription>
              </CardHeader>
              <CardContent>
                {getBMIvsBiochemical("totalCholesterol").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bmi" name="BMI" />
                      <YAxis dataKey="value" name="totalCholesterol" />
                      <Tooltip />
                      <Scatter data={getBMIvsBiochemical("totalCholesterol")} fill="#ef4444" />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>BMI vs hdl</CardTitle>
                <CardDescription>Correlation between BMI and hdl</CardDescription>
              </CardHeader>
              <CardContent>
                {getBMIvsBiochemical("hdl").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bmi" name="BMI" />
                      <YAxis dataKey="value" name="hdl" />
                      <Tooltip />
                      <Scatter data={getBMIvsBiochemical("hdl")} fill="#ef4444" />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>BMI vs ldl</CardTitle>
                <CardDescription>Correlation between BMI and ldl</CardDescription>
              </CardHeader>
              <CardContent>
                {getBMIvsBiochemical("ldl").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bmi" name="BMI" />
                      <YAxis dataKey="value" name="ldl" />
                      <Tooltip />
                      <Scatter data={getBMIvsBiochemical("ldl")} fill="#ef4444" />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>BMI vs triglycerides</CardTitle>
                <CardDescription>Correlation between BMI and triglycerides</CardDescription>
              </CardHeader>
              <CardContent>
                {getBMIvsBiochemical("triglycerides").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bmi" name="BMI" />
                      <YAxis dataKey="value" name="triglycerides" />
                      <Tooltip />
                      <Scatter data={getBMIvsBiochemical("triglycerides")} fill="#ef4444" />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
            

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>Prakriti vs BMI</CardTitle>
                <CardDescription>BMI distribution across Prakriti types</CardDescription>
              </CardHeader>
              <CardContent>
                {getPrakritiVsBMI().length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="prakriti" />
                      <YAxis dataKey="bmi" />
                      <Tooltip />
                      <Scatter data={getPrakritiVsBMI()} fill="#8b5cf6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader>
              <CardTitle>Prakriti vs HbA1c</CardTitle>
              <CardDescription>Average HbA1c by Prakriti</CardDescription>
              </CardHeader>
              <CardContent>
                {getPrakritiVsBiochemical("hba1c").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPrakritiVsBiochemical("hba1c")}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="prakriti" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader>
              <CardTitle>Prakriti vs totalCholesterol</CardTitle>
              <CardDescription>Average totalCholesterol by Prakriti</CardDescription>
              </CardHeader>
              <CardContent>
                {getPrakritiVsBiochemical("totalCholesterol").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPrakritiVsBiochemical("totalCholesterol")}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="prakriti" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader>
              <CardTitle>Prakriti vs HDL</CardTitle>
              <CardDescription>Average HDL by Prakriti</CardDescription>
              </CardHeader>
              <CardContent>
                {getPrakritiVsBiochemical("hdl").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPrakritiVsBiochemical("hdl")}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="prakriti" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader>
              <CardTitle>Prakriti vs LDL</CardTitle>
              <CardDescription>Average LDL by Prakriti</CardDescription>
              </CardHeader>
              <CardContent>
                {getPrakritiVsBiochemical("ldl").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPrakritiVsBiochemical("ldl")}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="prakriti" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader>
              <CardTitle>Prakriti vs Triglycerides</CardTitle>
              <CardDescription>Average Triglycerides by Prakriti</CardDescription>
              </CardHeader>
              <CardContent>
                {getPrakritiVsBiochemical("triglycerides").length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getPrakritiVsBiochemical("triglycerides")}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="prakriti" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#14b8a6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader>
                <CardTitle>Cholesterol Distribution</CardTitle>
                <CardDescription>Total cholesterol categories</CardDescription>
              </CardHeader>
              <CardContent>
                {cholesterolDistribution.some((d) => d.count > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={cholesterolDistribution} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#eab308" name="Count" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-slate-500 dark:text-slate-400">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Export Tab */}
        <TabsContent value="data" className="space-y-6 mt-6">
          <Card className="border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <CardTitle>Master Assessment Data</CardTitle>
                  <CardDescription>All submitted assessments with complete data for analysis</CardDescription>
                </div>
                <Button
                onClick={() => {window.location.href = "/api/admin/export"}}
                  // onClick={() => exportMasterDataAsCSV()}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white hover:shadow-lg"
                >
                  Export Master CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        Assessment ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Employee</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                        Submitted
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Age</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">BMI</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Glucose</th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">BP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {masterData.length > 0 ? (
                      masterData.slice(0, 15).map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <td className="py-3 px-4 text-slate-900 dark:text-white font-mono text-xs">
                            {row.assessmentId?.substring(0, 10)}...
                          </td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white">{row.employeeName}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs">
                            {new Date(row.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white">
                            {row.basicInfo_age ? (
                              row.basicInfo_age
                            ) : (
                              <span className="text-red-500 font-semibold">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white">
                            {row.clinicalAssessment_bmi ? (
                              Number.parseFloat(row.clinicalAssessment_bmi).toFixed(1)
                            ) : (
                              <span className="text-red-500 font-semibold">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white">
                            {row.clinicalAssessment_bloodGlucose ? (
                              Number.parseFloat(row.clinicalAssessment_bloodGlucose).toFixed(0)
                            ) : (
                              <span className="text-red-500 font-semibold">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-900 dark:text-white text-xs">
                            {row.clinicalAssessment_systolicBP ? (
                              `${row.clinicalAssessment_systolicBP}/${row.clinicalAssessment_diastolicBP || "—"}`
                            ) : (
                              <span className="text-red-500 font-semibold">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-500 dark:text-slate-400">
                          No assessments submitted yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {masterData.length > 15 && (
                  <div className="text-center py-4 text-slate-600 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    Showing 15 of {masterData.length} total assessments. Export CSV for complete dataset.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 shadow-md">
            <CardHeader>
              <CardTitle className="text-base text-blue-900 dark:text-blue-100">Data Export Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <p className="font-medium">The exported CSV contains:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>All submitted assessment data from all participants</li>
                <li>Complete metrics from all 5 forms (Basic, Clinical, Lifestyle, Biochemical, IDRS)</li>
                <li>Timestamps for temporal analysis</li>
                <li>All clinical, lifestyle, biochemical, and Prakriti metrics</li>
                <li>Ready for trend analysis, clustering, and diabetes risk prediction models</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
