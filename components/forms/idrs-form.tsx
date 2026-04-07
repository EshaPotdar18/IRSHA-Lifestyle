"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"


interface IDRSData {
  gender: string | null
  age: string | null
  abdominalObesity: string | null
  physicalActivity: string | null
  familyHistoryDiabetes: string | null
  totalScore: number | null
}

interface IDRSFormProps {
  data: IDRSData
  onUpdate: (data: IDRSData) => void
}

const IDRS_DEFAULT: IDRSData = {
  gender: null,
  age: null,
  abdominalObesity: null,
  physicalActivity: null,
  familyHistoryDiabetes: null,
  totalScore: null,
}

// export default function IDRSForm({ data, onUpdate }: IDRSFormProps) {
//   // ✅ initialize ONCE from props (no syncing loop)
//   const [formData, setFormData] = useState<IDRSData>(() => ({
//     gender: data?.gender ?? "",
//     age: data?.age ?? "",
//     abdominalObesity: data?.abdominalObesity ?? "",
//     physicalActivity: data?.physicalActivity ?? "",
//     familyHistoryDiabetes: data?.familyHistoryDiabetes ?? "",
//     totalScore: data?.totalScore ?? 0,
//   }))

export default function IDRSForm({ data, onUpdate }: IDRSFormProps) {
  const [formData, setFormData] = useState<IDRSData>({
    ...IDRS_DEFAULT,
    ...data,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // useEffect(() => {
  //   setFormData(data || {})
  // }, [data])

  // -------------------- AUTO-FETCH BASIC + CLINICAL --------------------
  
  // useEffect(() => {
  //   // Update form if parent data changes
  //   const updated: IDRSData = {
  //     gender: data.gender || "",
  //     age: data.age || "",
  //     abdominalObesity: data.abdominalObesity || "",
  //     physicalActivity: data.physicalActivity || "",
  //     familyHistoryDiabetes: data.familyHistoryDiabetes || "",
  //     totalScore: data.totalScore ?? calculateScore(data as IDRSData),
  //   }
  //   setFormData(updated)
  //   onUpdate(updated)
  // }, [data, onUpdate])
  
  // -------------------- HELPERS --------------------
  // const mapAgeNumberToCategory = (ageNum: number) => {
  //   if (ageNum < 35) return "<35"
  //   if (ageNum <= 49) return "35-49"
  //   return ">=50"
  // }

  // const mapWaistToLevel = (waistCm: number, gender?: string) => {
  //   const g = (gender || "").toLowerCase()
  //   const isFemale = g === "f" || g === "female"

  //   if (isFemale) {
  //     if (waistCm < 80) return "level1"
  //     if (waistCm <= 89) return "level2"
  //     return "level3"
  //   } else {
  //     if (waistCm < 90) return "level1"
  //     if (waistCm <= 99) return "level2"
  //     return "level3"
  //   }
  // }

  // -------------------- CORE CHANGE --------------------
  const calculateScore = (data: IDRSData) => {
    let score = 0

    if (data.age === "35-49") score += 20
    else if (data.age === ">=50") score += 30

    if (data.abdominalObesity === "level2") score += 10
    else if (data.abdominalObesity === "level3") score += 20

    if (data.physicalActivity === "regularORstrenuous") score += 20
    else if (data.physicalActivity === "sedentary") score += 30

    if (data.familyHistoryDiabetes === "one-parent") score += 10
    else if (data.familyHistoryDiabetes === "both-parents") score += 20

    return score
  }

  //   const handleChange = (field: keyof IDRSData, value: string) => {
  //   setFormData(prev => {
  //     const updated = { ...prev, [field]: value }
  //     updated.totalScore = calculateScore(updated)
      
  //     // Save to localStorage for summary/dashboard
  //     // localStorage.setItem("idrs", JSON.stringify(updated))
      
  //     // Notify parent
  //     onUpdate(updated)
  //     return updated
  //   })
  // }

  const handleChange = (field: keyof IDRSData, value: string) => {
  setFormData(prev => {
    const updated = { ...prev, [field]: value }
    updated.totalScore = calculateScore(updated)
    return updated
  })
}

useEffect(() => {
  onUpdate(formData)
}, [formData])

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: "Low Risk", color: "text-green-600" }
    if (score < 60) return { level: "Moderate Risk", color: "text-yellow-600" }
    return { level: "High Risk", color: "text-red-600" }
  }

  const score = formData.totalScore ?? 0
  const riskAssessment = getRiskLevel(score)

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(180deg, #f3f8ff 0%, #e9f0ff 35%, #f7fbff 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 flex items-center gap-3">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="drop-shadow">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0" stopColor="#4f9cf9" />
                      <stop offset="1" stopColor="#6ec1ff" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2C9.243 2 7 4.243 7 7c0 2.757 2.243 5 5 5s5-2.243 5-5c0-2.757-2.243-5-5-5z" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 22c0-4 4-7 8-7s8 3 8 7" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                IDRS - Diabetes Risk Assessment
              </h1>
              <p className="text-sm text-slate-600 mt-1">Assess Indian Diabetes Risk Score (IDRS) for participants</p>
            </div>
          </div>
          <div className="mt-4 h-1 rounded-full overflow-hidden">
            <div
              className="h-1 w-48 rounded-full animate-slide"
              style={{ background: "linear-gradient(90deg,#60a5fa,#3b82f6,#60a5fa)", boxShadow: "0 6px 20px rgba(59,130,246,0.1)" }}
            />
          </div>
        </div>

        {/* Form Cards */}
        <div className="space-y-6">

          {/* Gender Card */}
          <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
            <CardHeader className="bg-transparent border-b-0 px-6">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                Gender
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <RadioGroup value={formData.gender || ""} onValueChange={(value) => handleChange("gender", value)}>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="M" id="gender-m" />
                    <Label htmlFor="gender-m" className="text-slate-700">Male</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="F" id="gender-f" />
                    <Label htmlFor="gender-f" className="text-slate-700">Female</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="O" id="gender-o" />
                    <Label htmlFor="gender-o" className="text-slate-700">Other</Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Age Card */}
          <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
            <CardHeader className="bg-transparent border-b-0 px-6">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                Age Group
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <RadioGroup value={formData.age || ""} onValueChange={(value) => handleChange("age", value)}>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="<35" id="age-lt35" />
                    <Label htmlFor="age-lt35" className="text-slate-700">&lt;35 years (0 pts)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="35-49" id="age-35-49" />
                    <Label htmlFor="age-35-49" className="text-slate-700">35–49 years (20 pts)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value=">=50" id="age-gt50" />
                    <Label htmlFor="age-gt50" className="text-slate-700">≥50 years (30 pts)</Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Waist Card */}
          <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
            <CardHeader className="bg-transparent border-b-0 px-6">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                Waist Circumference
              </CardTitle>
              <CardDescription className="text-slate-600">(Auto-filled if available)</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <RadioGroup value={formData.abdominalObesity || ""} onValueChange={(value) => handleChange("abdominalObesity", value)}>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="level1" id="waist-l1" />
                    <Label htmlFor="waist-l1" className="text-slate-700">Females &lt;80 cm / Males &lt;90 cm (0 pts)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="level2" id="waist-l2" />
                    <Label htmlFor="waist-l2" className="text-slate-700">Females 80-89 cm / Males 90-99 cm (10 pts)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="level3" id="waist-l3" />
                    <Label htmlFor="waist-l3" className="text-slate-700">Females ≥90 cm / Males ≥100 cm (20 pts)</Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Physical Activity Card */}
          <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
            <CardHeader className="bg-transparent border-b-0 px-6">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">Physical Activity</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <RadioGroup value={formData.physicalActivity || ""} onValueChange={(value) => handleChange("physicalActivity", value)}>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="regular+strenuous" id="pa-opt1" />
                    <Label htmlFor="pa-opt1" className="text-slate-700">Regular + strenuous (0 pts)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="regularORstrenuous" id="pa-opt2" />
                    <Label htmlFor="pa-opt2" className="text-slate-700">Regular OR strenuous (20 pts)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="sedentary" id="pa-opt3" />
                    <Label htmlFor="pa-opt3" className="text-slate-700">Sedentary (30 pts)</Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Family History Card */}
          <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
            <CardHeader className="bg-transparent border-b-0 px-6">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">Family History of Diabetes</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <RadioGroup value={formData.familyHistoryDiabetes || ""} onValueChange={(value) => handleChange("familyHistoryDiabetes", value)}>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="none" id="fh-none" />
                    <Label htmlFor="fh-none" className="text-slate-700">No family history (0 pts)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="one-parent" id="fh-one" />
                    <Label htmlFor="fh-one" className="text-slate-700">One parent (10 pts)</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                    <RadioGroupItem value="both-parents" id="fh-both" />
                    <Label htmlFor="fh-both" className="text-slate-700">Both parents (20 pts)</Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* IDRS Score Card */}
          <Card className="border-0 shadow-md overflow-visible bg-gradient-to-br from-blue-50 to-slate-50">
            <CardHeader className="bg-blue-100 border-b border-blue-200 px-6">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">IDRS Score</CardTitle>
              <CardDescription className="text-slate-600">Indian Diabetes Risk Score Assessment</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-white p-4 border border-slate-200">
                  <p className="text-sm text-slate-600 font-medium">Total Score (out of 100)</p>
                  <p className="text-3xl font-bold text-blue-600">{score}</p>
                </div>
                <div className="rounded-lg bg-white p-4 border border-slate-200">
                  <p className="text-sm text-slate-600 font-medium">Risk Level</p>
                  <p className={`text-2xl font-bold ${riskAssessment.color}`}>{riskAssessment.level}</p>
                </div>
                <div className="rounded-lg bg-white p-4 border border-slate-200">
                  <p className="text-sm text-slate-600 font-medium">Recommendation</p>
                  <p className="text-sm text-slate-700 font-medium">
                    {score < 30
                      ? "Regular screening"
                      : score < 60
                      ? "Annual screening"
                      : "Immediate consultation"}

                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}


// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"

// interface IDRSData {
//    name: string | null
//   gender: string | null
//   contact: string | null
//   address: string | null

//   age: string | null
//   waist: string | null
//   abdominalObesity: string | null
//   physicalActivity: string | null
//   familyHistoryDiabetes: string | null

//   bloodPressure: string | null
//   bloodGlucose: string | null
// }

// interface IDRSFormProps {
//   data: IDRSData
//   onUpdate: (data: IDRSData) => void
// }

// const DEFAULT_IDRS: IDRSData = {
//   name: null,
//   gender: null,
//   contact: null,
//   address: null,

//   age: null,
//   waist: null,
//   abdominalObesity: null,
//   physicalActivity: null,
//   familyHistoryDiabetes: null,

//   bloodPressure: null,
//   bloodGlucose: null,

//   totalScore: 0,
// }

// export default function IDRSForm({ data, onUpdate }: IDRSFormProps) {
//   const [formData, setFormData] = useState<IDRSData>({
//     ...DEFAULT_IDRS,
//     ...(data || {}),
//   })

//   useEffect(() => {
//     window.scrollTo(0, 0)
//   }, [])

//  /* ---------------- SYNC FROM PARENT ---------------- */



//   // -------------------- AUTO-FETCH BASIC INFO + CLINICAL --------------------
//   useEffect(() => {
//     try {
//       const basicRaw = localStorage.getItem("basicInfo")
//       const clinicalRaw = localStorage.getItem("clinical")

//       if (basicRaw) {
//         const basic = JSON.parse(basicRaw)
//         const gotAge = basic?.age ?? basic?.dob ?? null
//         let ageNumber: number | null = null

//         if (typeof gotAge === "number") ageNumber = gotAge
//         else if (typeof gotAge === "string") {
//           const parsed = Number(gotAge)
//           if (!Number.isNaN(parsed)) ageNumber = parsed
//         }

//         if (ageNumber != null) {
//           setNumericAge(ageNumber)
//           const cat = mapAgeNumberToCategory(ageNumber)

//           setFormData((prev) => {
//             const updated = { ...prev, age: prev.age ? prev.age : cat }
//             onUpdate?.(updated)
//             return updated
//           })
//         }

//         if (basic?.gender && !formData.gender) {
//           setFormData((prev) => {
//             const updated = { ...prev, gender: basic.gender }
//             onUpdate?.(updated)
//             return updated
//           })
//         }
//       }

//       if (clinicalRaw) {
//         const clinical = JSON.parse(clinicalRaw)
//         const wc = clinical?.waistCm ?? clinical?.waist ?? null
//         let waistNumber: number | null = null

//         if (typeof wc === "number") waistNumber = wc
//         else if (typeof wc === "string") {
//           const parsed = Number(wc)
//           if (!Number.isNaN(parsed)) waistNumber = parsed
//         }

//         if (waistNumber != null) {
//           setNumericWaist(waistNumber)

//           const gender = formData.gender || (() => {
//             try {
//               const b = JSON.parse(localStorage.getItem("basicInfo") || "{}")
//               return b?.gender
//             } catch {
//               return undefined
//             }
//           })()

//           const level = mapWaistToLevel(waistNumber, gender)

//           setFormData((prev) => {
//             const updated = {
//               ...prev,
//               waist: String(waistNumber),
//               abdominalObesity: prev.abdominalObesity ? prev.abdominalObesity : level
//             }
//             onUpdate?.(updated)
//             return updated
//           })
//         }
//       }
//     } catch {}
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   // -------------------- HELPERS --------------------
//   const mapAgeNumberToCategory = (ageNum: number) => {
//     if (ageNum < 35) return "<35"
//     if (ageNum >= 35 && ageNum <= 49) return "35-49"
//     return ">=50"
//   }

//   const mapWaistToLevel = (waistCm: number, gender?: string | null) => {
//     const g = (gender || "").toString().toLowerCase()
//     const isFemale = g === "f" || g === "female"

//     if (isFemale) {
//       if (waistCm < 80) return "level1"
//       if (waistCm <= 89) return "level2"
//       return "level3"
//     } else {
//       if (waistCm < 90) return "level1"
//       if (waistCm <= 99) return "level2"
//       return "level3"
//     }
//   }


//   //   if (field === "ageNumeric") {
//   //     const parsed = Number(value)
//   //     if (!Number.isNaN(parsed)) {
//   //       setNumericAge(parsed)
//   //       updated.age = mapAgeNumberToCategory(parsed)
//   //     }
//   //   }

//   //   if (field === "waist") {
//   //     const parsed = Number(value)
//   //     if (!Number.isNaN(parsed)) {
//   //       setNumericWaist(parsed)
//   //       updated.abdominalObesity = mapWaistToLevel(parsed, updated.gender || formData.gender)
//   //     } else {
//   //       setNumericWaist(null)
//   //     }
//   //   }

//   //   if (field === "gender" && numericWaist != null) {
//   //     updated.abdominalObesity = mapWaistToLevel(numericWaist, value)
//   //   }

//   //   setFormData(updated)
//   //   calculateScore(updated)
//   //   onUpdate(updated)
//   // }

//   const calculateScore = (data: IDRSData) => {
//     let score = 0
//     if (data.age === "<35") score += 0
//     else if (data.age === "35-49") score += 20
//     else if (data.age === ">=50") score += 30

//     if (data.abdominalObesity === "level1") score += 0
//     else if (data.abdominalObesity === "level2") score += 10
//     else if (data.abdominalObesity === "level3") score += 20

//     if (data.physicalActivity === "regular+strenuous") score += 0
//     else if (data.physicalActivity === "regularORstrenuous") score += 20
//     else if (data.physicalActivity === "sedentary") score += 30

//     if (data.familyHistoryDiabetes === "none") score += 0
//     else if (data.familyHistoryDiabetes === "one-parent") score += 10
//     else if (data.familyHistoryDiabetes === "both-parents") score += 20

//     return score
//   }

//   const score = calculateScore(formData)

//   const getRiskLevel = (score: number) => {
//     if (score < 30) return { level: "Low Risk", color: "text-green-600" }
//     if (score < 60) return { level: "Moderate Risk", color: "text-yellow-600" }
//     return { level: "High Risk", color: "text-red-600" }
//   }

//   const riskAssessment = getRiskLevel(score)

//   const displayValue = (value?: string | number) => value ?? "Null"

//   return (
//     <div
//       className="min-h-screen py-10 px-4 sm:px-6 lg:px-8"
//       style={{ background: "linear-gradient(180deg, #f3f8ff 0%, #e9f0ff 35%, #f7fbff 100%)" }}
//     >
//       <div className="max-w-5xl mx-auto">
//         {/* Page Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 flex items-center gap-3">
//                 <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="drop-shadow">
//                   <defs>
//                     <linearGradient id="g1" x1="0" x2="1">
//                       <stop offset="0" stopColor="#4f9cf9" />
//                       <stop offset="1" stopColor="#6ec1ff" />
//                     </linearGradient>
//                   </defs>
//                   <path d="M12 2C9.243 2 7 4.243 7 7c0 2.757 2.243 5 5 5s5-2.243 5-5c0-2.757-2.243-5-5-5z" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M4 22c0-4 4-7 8-7s8 3 8 7" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 IDRS - Diabetes Risk Assessment
//               </h1>
//               <p className="text-sm text-slate-600 mt-1">Assess Indian Diabetes Risk Score (IDRS) for participants</p>
//             </div>
//           </div>
//           <div className="mt-4 h-1 rounded-full overflow-hidden">
//             <div
//               className="h-1 w-48 rounded-full animate-slide"
//               style={{ background: "linear-gradient(90deg,#60a5fa,#3b82f6,#60a5fa)", boxShadow: "0 6px 20px rgba(59,130,246,0.1)" }}
//             />
//           </div>
//         </div>

//         {/* Form Cards */}
//         <div className="space-y-6">

//           {/* Gender Card */}
//           <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
//             <CardHeader className="bg-transparent border-b-0 px-6">
//               <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
//                 Gender
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="px-6 pb-8">
//               <RadioGroup value={formData.gender || ""} onValueChange={(value) => handleChange("gender", value)}>
//                 <div className="grid grid-cols-3 gap-3">
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="M" id="gender-m" />
//                     <Label htmlFor="gender-m" className="text-slate-700">Male</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="F" id="gender-f" />
//                     <Label htmlFor="gender-f" className="text-slate-700">Female</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="O" id="gender-o" />
//                     <Label htmlFor="gender-o" className="text-slate-700">Other</Label>
//                   </div>
//                 </div>
//               </RadioGroup>
//             </CardContent>
//           </Card>

//           {/* Age Card */}
//           <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
//             <CardHeader className="bg-transparent border-b-0 px-6">
//               <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
//                 Age Group
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="px-6 pb-8">
//               <RadioGroup value={formData.age || ""} onValueChange={(value) => handleChange("age", value)}>
//                 <div className="grid grid-cols-3 gap-3">
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="<35" id="age-lt35" />
//                     <Label htmlFor="age-lt35" className="text-slate-700">&lt;35 years (0 pts)</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="35-49" id="age-35-49" />
//                     <Label htmlFor="age-35-49" className="text-slate-700">35–49 years (20 pts)</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value=">=50" id="age-gt50" />
//                     <Label htmlFor="age-gt50" className="text-slate-700">≥50 years (30 pts)</Label>
//                   </div>
//                 </div>
//               </RadioGroup>
//             </CardContent>
//           </Card>

//           {/* Waist Card */}
//           <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
//             <CardHeader className="bg-transparent border-b-0 px-6">
//               <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
//                 Waist Circumference
//               </CardTitle>
//               <CardDescription className="text-slate-600">(Auto-filled if available)</CardDescription>
//             </CardHeader>
//             <CardContent className="px-6 pb-8">
//               <RadioGroup value={formData.abdominalObesity || ""} onValueChange={(value) => handleChange("abdominalObesity", value)}>
//                 <div className="grid grid-cols-3 gap-3">
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="level1" id="waist-l1" />
//                     <Label htmlFor="waist-l1" className="text-slate-700">Females &lt;80 cm / Males &lt;90 cm (0 pts)</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="level2" id="waist-l2" />
//                     <Label htmlFor="waist-l2" className="text-slate-700">Females 80-89 cm / Males 90-99 cm (10 pts)</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="level3" id="waist-l3" />
//                     <Label htmlFor="waist-l3" className="text-slate-700">Females ≥90 cm / Males ≥100 cm (20 pts)</Label>
//                   </div>
//                 </div>
//               </RadioGroup>
//             </CardContent>
//           </Card>

//           {/* Physical Activity Card */}
//           <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
//             <CardHeader className="bg-transparent border-b-0 px-6">
//               <CardTitle className="text-lg text-slate-900 flex items-center gap-3">Physical Activity</CardTitle>
//             </CardHeader>
//             <CardContent className="px-6 pb-8">
//               <RadioGroup value={formData.physicalActivity || ""} onValueChange={(value) => handleChange("physicalActivity", value)}>
//                 <div className="grid grid-cols-3 gap-3">
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="regular+strenuous" id="pa-opt1" />
//                     <Label htmlFor="pa-opt1" className="text-slate-700">Regular + strenuous (0 pts)</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="regularORstrenuous" id="pa-opt2" />
//                     <Label htmlFor="pa-opt2" className="text-slate-700">Regular OR strenuous (20 pts)</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="sedentary" id="pa-opt3" />
//                     <Label htmlFor="pa-opt3" className="text-slate-700">Sedentary (30 pts)</Label>
//                   </div>
//                 </div>
//               </RadioGroup>
//             </CardContent>
//           </Card>

//           {/* Family History Card */}
//           <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
//             <CardHeader className="bg-transparent border-b-0 px-6">
//               <CardTitle className="text-lg text-slate-900 flex items-center gap-3">Family History of Diabetes</CardTitle>
//             </CardHeader>
//             <CardContent className="px-6 pb-8">
//               <RadioGroup value={formData.familyHistoryDiabetes || ""} onValueChange={(value) => handleChange("familyHistoryDiabetes", value)}>
//                 <div className="grid grid-cols-3 gap-3">
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="none" id="fh-none" />
//                     <Label htmlFor="fh-none" className="text-slate-700">No family history (0 pts)</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="one-parent" id="fh-one" />
//                     <Label htmlFor="fh-one" className="text-slate-700">One parent (10 pts)</Label>
//                   </div>
//                   <div className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem value="both-parents" id="fh-both" />
//                     <Label htmlFor="fh-both" className="text-slate-700">Both parents (20 pts)</Label>
//                   </div>
//                 </div>
//               </RadioGroup>
//             </CardContent>
//           </Card>

//           {/* IDRS Score Card */}
//           <Card className="border-0 shadow-md overflow-visible bg-gradient-to-br from-blue-50 to-slate-50">
//             <CardHeader className="bg-blue-100 border-b border-blue-200 px-6">
//               <CardTitle className="text-lg text-slate-900 flex items-center gap-3">IDRS Score</CardTitle>
//               <CardDescription className="text-slate-600">Indian Diabetes Risk Score Assessment</CardDescription>
//             </CardHeader>
//             <CardContent className="px-6 pb-8">
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                 <div className="rounded-lg bg-white p-4 border border-slate-200">
//                   <p className="text-sm text-slate-600 font-medium">Total Score (out of 100)</p>
//                   <p className="text-3xl font-bold text-blue-600">{score}</p>
//                 </div>
//                 <div className="rounded-lg bg-white p-4 border border-slate-200">
//                   <p className="text-sm text-slate-600 font-medium">Risk Level</p>
//                   <p className={`text-2xl font-bold ${riskAssessment.color}`}>{riskAssessment.level}</p>
//                 </div>
//                 <div className="rounded-lg bg-white p-4 border border-slate-200">
//                   <p className="text-sm text-slate-600 font-medium">Recommendation</p>
//                   <p className="text-sm text-slate-700 font-medium">
//                     {score < 30 ? "Regular screening" : score < 60 ? "Annual screening" : "Immediate consultation"}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//         </div>
//       </div>
//     </div>
//   )
// }
