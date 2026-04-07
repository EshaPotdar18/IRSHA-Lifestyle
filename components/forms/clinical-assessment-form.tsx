"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface ClinicalAssessmentData {
  height?: string
  weight?: string
  bmi?: string
  systolicBP?: string
  diastolicBP?: string
  heartRate?: string
  pulse?: string
  hrv?: string
  bloodGlucose?: string
  waist?: string
  hip?: string
  whr?: string
  bodyFat?: string
  visceralFat?: string
  subcutFat?: string
  muscleMass?: string
  restingMetabolism?: string
  bodyAge?: string
  presentComplaint?: string
  currentMeds?: string
  hadCovid?: string
  vaccineHistory?: string[]
  familyHistoryObesity?: string
  familyHistoryDiabetes?: string
  familyHistoryObesityDuration?: string
  familyHistoryObesityDetails?: string
  familyHistoryDiabetesDetails?: string
  familyHistoryDiabetesDuration?: string
  medications?: string
  familyHistoryHypertension?: string
  familyHistoryHypertensionDuration?: string
  familyHistoryHypertensionDetails?: string
}

interface ClinicalAssessmentFormProps {
  data: ClinicalAssessmentData
  onUpdate: (data: ClinicalAssessmentData) => void
}

export default function ClinicalAssessmentForm({ data, onUpdate }: ClinicalAssessmentFormProps) {
  const [formData, setFormData] = useState<ClinicalAssessmentData>(data || {})

  // ⬇️ SCROLL TO TOP WHEN COMPONENT LOADS ⬇️
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setFormData(data || {})
  }, [data])

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  const calculateBMI = (height: string, weight: string) => {
    if (height && weight) {
      const h = Number.parseFloat(height) / 100
      const w = Number.parseFloat(weight)
      const bmi = (w / (h * h)).toFixed(2)
      return bmi
    }
    return ""
  }

  const calculateWHR = (waist: string, hip: string) => {
    if (waist && hip) {
      const w = Number.parseFloat(waist)
      const h = Number.parseFloat(hip)
      if (h > 0) return (w / h).toFixed(2)
    }
    return ""
  }

  const handleWaistHipChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    const waist = field === "waist" ? value : formData.waist
    const hip = field === "hip" ? value : formData.hip
    updated.whr = calculateWHR(waist || "", hip || "")
    setFormData(updated)
    onUpdate(updated)
  }

  const handleHeightWeightChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value }
    if (field === "height" || field === "weight") {
      const height = field === "height" ? value : formData.height
      const weight = field === "weight" ? value : formData.weight
      updated.bmi = calculateBMI(height || "", weight || "")
    }
    setFormData(updated)
    onUpdate(updated)
  }

  return (

     <div
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-10"
      style={{
        background:
          "linear-gradient(180deg, #f3f8ff 0%, #e9f0ff 35%, #f7fbff 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page header */}
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
                  <path d="M12 2C9.243 2 7 4.243 7 7c0 2.757 2.243 5 5 5s5-2.243 5-5c0-2.757-2.243-5-5-5z" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 22c0-4 4-7 8-7s8 3 8 7" stroke="url(#g1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Clinical Assessment - Patient Form
                </h1>
              <p className="text-sm text-slate-600 mt-1">Complete physical measurements, vitals and family history</p>
            </div>

            <div className="hidden sm:flex items-center">
            </div>
          </div>

          {/* subtle animated underline */}
          <div className="mt-4 h-1 rounded-full overflow-hidden">
            <div
              className="h-1 w-48 rounded-full animate-slide"
              style={{
                background: "linear-gradient(90deg,#60a5fa,#3b82f6,#60a5fa)",
                boxShadow: "0 6px 20px rgba(59,130,246,0.1)"
              }}
            />
          </div>
        </div>

        {/* FORM cards container */}
        <div className="space-y-6">

          <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
            <CardHeader className="bg-transparent border-b-0 px-6">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M7 7h10" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Clinical Assessments
              </CardTitle>
              <CardDescription className="text-slate-600">Physical measurements and vital signs</CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-slate-700 font-medium">
                    Height (cm) *
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height in cm"
                    value={formData.height || ""}
                    onChange={(e) => handleHeightWeightChange("height", e.target.value)}
                    className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-slate-700 font-medium">
                    Weight (kg) *
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight in kg"
                    value={formData.weight || ""}
                    onChange={(e) => handleHeightWeightChange("weight", e.target.value)}
                    className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </div>

                {/* BMI */}
                <div className="space-y-2">
                  <Label htmlFor="bmi" className="text-slate-700 font-medium flex items-center justify-between">
                    <span>BMI (Auto-calculated)</span>
                    <span className="text-xs text-slate-500">kg / m²</span>
                  </Label>
                  <Input
                    id="bmi"
                    type="number"
                    placeholder="BMI will be calculated"
                    value={formData.bmi || ""}
                    readOnly
                    className="border-slate-300 bg-blue-50/60 rounded-lg shadow-inner"
                  />
                </div>

                {/* Pulse */}
                <div className="space-y-2">
                  <Label htmlFor="pulse" className="text-slate-700 font-medium">Pulse (per min)</Label>
                  <Input
                    id="pulse"
                    type="number"
                    placeholder="Enter pulse"
                    value={formData.pulse || ""}
                    onChange={(e) => handleChange("pulse", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* HRV */}
                <div className="space-y-2">
                  <Label htmlFor="hrv" className="text-slate-700 font-medium">Heart Rate Variability (ms)</Label>
                  <Input
                    id="hrv"
                    type="number"
                    placeholder="Enter heart rate variability"
                    value={formData.hrv || ""}
                    onChange={(e) => handleChange("hrv", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Heart Rate */}
                <div className="space-y-2">
                  <Label htmlFor="heartRate" className="text-slate-700 font-medium">
                    Heart Rate (bpm)
                  </Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="Enter heart rate"
                    value={formData.heartRate || ""}
                    onChange={(e) => handleChange("heartRate", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Systolic BP */}
                <div className="space-y-2">
                  <Label htmlFor="systolicBP" className="text-slate-700 font-medium">
                    Systolic BP (mmHg)
                  </Label>
                  <Input
                    id="systolicBP"
                    type="number"
                    placeholder="Enter systolic BP"
                    value={formData.systolicBP || ""}
                    onChange={(e) => handleChange("systolicBP", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Diastolic BP */}
                <div className="space-y-2">
                  <Label htmlFor="diastolicBP" className="text-slate-700 font-medium">
                    Diastolic BP (mmHg)
                  </Label>
                  <Input
                    id="diastolicBP"
                    type="number"
                    placeholder="Enter diastolic BP"
                    value={formData.diastolicBP || ""}
                    onChange={(e) => handleChange("diastolicBP", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Blood Glucose */}
                <div className="space-y-2">
                  <Label htmlFor="bloodGlucose" className="text-slate-700 font-medium">
                    Random Blood Glucose (mg/dL)
                  </Label>
                  <Input
                    id="bloodGlucose"
                    type="number"
                    placeholder="Enter random blood glucose"
                    value={formData.bloodGlucose || ""}
                    onChange={(e) => handleChange("bloodGlucose", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Body Circumference & Composition */}
          <Card className="border-0 shadow-md" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.9))" }}>
            <CardHeader className="bg-transparent border-b-0 px-6">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3v18" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M3 12h18" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Body Circumference & Composition
              </CardTitle>
              <CardDescription className="text-slate-600">Waist, hip ratio and body composition metrics</CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* Waist */}
                <div className="space-y-2">
                  <Label htmlFor="waist" className="text-slate-700 font-medium">Waist (cm)</Label>
                  <Input
                    id="waist"
                    type="number"
                    placeholder="Enter waist circumference"
                    value={formData.waist || ""}
                    onChange={(e) => handleWaistHipChange("waist", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Hip */}
                <div className="space-y-2">
                  <Label htmlFor="hip" className="text-slate-700 font-medium">Hip (cm)</Label>
                  <Input
                    id="hip"
                    type="number"
                    placeholder="Enter hip circumference"
                    value={formData.hip || ""}
                    onChange={(e) => handleWaistHipChange("hip", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* WHR */}
                <div className="space-y-2">
                  <Label htmlFor="whr" className="text-slate-700 font-medium">Waist-Hip Ratio (Auto-Calculated)</Label>
                  <Input
                    id="whr"
                    type="number"
                    value={formData.whr || ""}
                    readOnly
                    className="border-slate-300 bg-blue-50/60 rounded-lg shadow-inner"
                  />
                </div>

                {/* Body Age */}
                <div className="space-y-2">
                  <Label htmlFor="bodyage" className="text-slate-700 font-medium">Body Age</Label>
                  <Input
                    id="bodyage"
                    type="number"
                    value={formData.bodyAge || ""}
                    onChange={(e) => handleChange("bodyAge", e.target.value)}
                    className="border-slate-300 bg-blue-50/40 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Body Fat % */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Body Fat (%)</Label>
                  <Input
                    type="number"
                    value={formData.bodyFat || ""}
                    onChange={(e) => handleChange("bodyFat", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Visceral Fat % */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Visceral Fat (%)</Label>
                  <Input
                    type="number"
                    value={formData.visceralFat || ""}
                    onChange={(e) => handleChange("visceralFat", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Subcutaneous Fat % */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Subcutaneous Fat (%)</Label>
                  <Input
                    type="number"
                    value={formData.subcutFat || ""}
                    onChange={(e) => handleChange("subcutFat", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Muscle Mass % */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Muscle Mass (%)</Label>
                  <Input
                    type="number"
                    value={formData.muscleMass || ""}
                    onChange={(e) => handleChange("muscleMass", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

                {/* Resting Metabolism */}
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Resting Metabolism (kCal)</Label>
                  <Input
                    type="number"
                    value={formData.restingMetabolism || ""}
                    onChange={(e) => handleChange("restingMetabolism", e.target.value)}
                    className="border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="border-0 shadow-md" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,252,255,0.95))" }}>
            <CardHeader className="bg-transparent border-b-0 px-6">
              <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M6 11h12" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Medical History
              </CardTitle>
              <CardDescription className="text-slate-600">Current and past medical conditions</CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-8 space-y-6">
              {/* Present complaints */}
              <div className="space-y-2">
                <Label>Present Complaints</Label>
                <Input
                  value={formData.presentComplaint || ""}
                  onChange={(e) => handleChange("presentComplaint", e.target.value)}
                  className="border-slate-300 bg-blue-50/40 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Current meds/supplements */}
              <div className="space-y-2">
                <Label>Current Medications / Supplements</Label>
                <Input
                  value={formData.currentMeds || ""}
                  onChange={(e) => handleChange("currentMeds", e.target.value)}
                  className="border-slate-300 bg-blue-50/40 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

{/* Had Covid */}
<div className="space-y-2">
  <Label>Have you had Covid?</Label>

  <RadioGroup
    value={formData.hadCovid || ""}
    onValueChange={(value) => handleChange("hadCovid", value)}
    className="flex items-center gap-6"
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem
        value="yes"
        id="had-covid-yes"
        className="
          h-4 w-4
          border-2 border-slate-400
          text-blue-600
          focus:ring-2 focus:ring-blue-300
        "
      />
      <Label htmlFor="had-covid-yes">Yes</Label>
    </div>

    <div className="flex items-center space-x-2">
      <RadioGroupItem
        value="no"
        id="had-covid-no"
        className="
          h-4 w-4
          border-2 border-slate-400
          text-blue-600
          focus:ring-2 focus:ring-blue-300
        "
      />
      <Label htmlFor="had-covid-no">No</Label>
    </div>
  </RadioGroup>
</div>


              {/* Vaccine multi-select */}
              <div className="space-y-2">
                <Label>Vaccine History</Label>
                  <div className="flex flex-wrap gap-6">
                {["1st dose", "2nd dose", "booster"].map((v) => {
                  const checked = formData.vaccineHistory?.includes(v) || false;

                  return (
                    <div
                      key={v}
                      className="
                        flex items-center space-x-2
                        rounded-md
                        bg-white
                        px-2 py-0.5
                        hover:border-slate-400
                        transition
                      "
                    >
                      <Checkbox
                        id={`vaccine-${v}`}
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          if (isChecked === "indeterminate") return;

                          const prev = formData.vaccineHistory || [];
                          const updated = isChecked
                            ? [...prev, v]
                            : prev.filter((i) => i !== v);

                          handleChange("vaccineHistory", updated);
                        }}
                        className="h-4 w-4 border-slate-400"
                      />

                      <Label
                        htmlFor={`vaccine-${v}`}
                        className="text-sm text-slate-700 cursor-pointer"
                      >
                        {v}
                      </Label>
                    </div>
                  );
                })}
              </div>
              </div>
            </CardContent>
          </Card>

          {/* FAMILY HISTORY CARD */}
<Card className="border-0 shadow-md" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(246,250,255,0.98))" }}>
  <CardHeader className="bg-transparent border-b-0 px-6">
    <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 7h10" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Family History
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-6 px-6 pb-10">

    {/* Obesity */}
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="familyObesity"
          checked={formData.familyHistoryObesity === "yes"}
          onCheckedChange={(checked) =>
            handleChange("familyHistoryObesity", checked ? "yes" : "no")
          }
          className="h-4 w-4 border-slate-400"
        />
        <Label htmlFor="familyObesity" className="font-normal cursor-pointer text-slate-700">
          Obesity in family
        </Label>
      </div>

      {formData.familyHistoryObesity === "yes" && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Who? (e.g., Mother, Father, Sibling)"
            className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formData.familyHistoryObesityDetails || ""}
            onChange={(e) =>
              handleChange("familyHistoryObesityDetails", e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Duration (years)"
            className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formData.familyHistoryObesityDuration || ""}
            onChange={(e) =>
              handleChange("familyHistoryObesityDuration", e.target.value)
            }
          />
        </div>
      )}
    </div>

    {/* Diabetes */}
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="familyDiabetes"
          checked={formData.familyHistoryDiabetes === "yes"}
          onCheckedChange={(checked) =>
            handleChange("familyHistoryDiabetes", checked ? "yes" : "no")
          }
          className="h-4 w-4 border-slate-400"
        />
        <Label htmlFor="familyDiabetes" className="font-normal cursor-pointer text-slate-700">
          Diabetes in family
        </Label>
      </div>

      {formData.familyHistoryDiabetes === "yes" && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Who? (e.g., Mother, Father, Sibling)"
            className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formData.familyHistoryDiabetesDetails || ""}
            onChange={(e) =>
              handleChange("familyHistoryDiabetesDetails", e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Duration (years)"
            className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formData.familyHistoryDiabetesDuration || ""}
            onChange={(e) =>
              handleChange("familyHistoryDiabetesDuration", e.target.value)
            }
          />
        </div>
      )}
    </div>

    {/* Hypertension */}
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="familyHypertension"
          checked={formData.familyHistoryHypertension === "yes"}
          onCheckedChange={(checked) =>
            handleChange("familyHistoryHypertension", checked ? "yes" : "no")
          }
          className="h-4 w-4 border-slate-400"
        />
        <Label htmlFor="familyHypertension" className="font-normal cursor-pointer text-slate-700">
          Hypertension in family
        </Label>
      </div>

      {formData.familyHistoryHypertension === "yes" && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Who? (e.g., Mother, Father, Sibling)"
            className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formData.familyHistoryHypertensionDetails || ""}
            onChange={(e) =>
              handleChange("familyHistoryHypertensionDetails", e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Duration (years)"
            className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={formData.familyHistoryHypertensionDuration || ""}
            onChange={(e) =>
              handleChange("familyHistoryHypertensionDuration", e.target.value)
            }
          />
        </div>
      )}
    </div>

    {/* Chronicity & Measures Taken remain unchanged */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label>Chronicity</Label>
        <div className="space-y-2 pt-2">
          <Input
            name="familyChronicity"
            onChange={(e) => handleChange("familyChronicity", e.target.value)}
            placeholder="chronic / acute / recurring"
            className="border-slate-300 bg-blue-50/30 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
      </div>

      <div>
        <Label>Measures Taken</Label>
        <div className="space-y-2 pt-2">
          <Input
            name="familyMeasuresTaken"
            onChange={(e) => handleChange("familyMeasuresTaken", e.target.value)}
            placeholder="exercise / diet / treatment..."
            className="border-slate-300 bg-blue-50/30 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
          />
        </div>
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
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Checkbox } from "@/components/ui/checkbox"

// interface ClinicalAssessmentData {
//   height?: string
//   weight?: string
//   bmi?: string
//   systolicBP?: string
//   diastolicBP?: string
//   heartRate?: string
//   pulse?: string
//   hrv?: string
//   bloodGlucose?: string
//   waist?: string
//   hip?: string
//   whr?: string
//   bodyFat?: string
//   visceralFat?: string
//   subcutFat?: string
//   muscleMass?: string
//   restingMetabolism?: string
//   bodyAge?: string
//   presentComplaint?: string
//   currentMeds?: string
//   hadCovid?: string
//   vaccineHistory?: string[]
//   familyHistoryObesity?: string
//   familyHistoryDiabetes?: string
//   familyHistoryObesityDuration?: string
//   familyHistoryObesityDetails?: string
//   familyHistoryDiabetesDetails?: string
//   familyHistoryDiabetesDuration?: string
//   medications?: string
//   familyHistoryHypertension?: string
//   familyHistoryHypertensionDuration?: string
//   familyHistoryHypertensionDetails?: string
// }

// interface ClinicalAssessmentFormProps {
//   data: ClinicalAssessmentData
//   onUpdate: (data: ClinicalAssessmentData) => void
// }

// export default function ClinicalAssessmentForm({ data, onUpdate }: ClinicalAssessmentFormProps) {
//   const [formData, setFormData] = useState<ClinicalAssessmentData>(data || {})

//     // ⬇️ SCROLL TO TOP WHEN COMPONENT LOADS ⬇️
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     setFormData(data || {})
//   }, [data])

//   const handleChange = (field: string, value: any) => {
//     const updated = { ...formData, [field]: value }
//     setFormData(updated)
//     onUpdate(updated)
//   }

//   const calculateBMI = (height: string, weight: string) => {
//     if (height && weight) {
//       const h = Number.parseFloat(height) / 100
//       const w = Number.parseFloat(weight)
//       const bmi = (w / (h * h)).toFixed(2)
//       return bmi
//     }
//     return ""
//   }

//   const calculateWHR = (waist: string, hip: string) => {
//   if (waist && hip) {
//     const w = Number.parseFloat(waist)
//     const h = Number.parseFloat(hip)
//     if (h > 0) return (w / h).toFixed(2)
//   }
//   return ""
//   }

//   const handleWaistHipChange = (field: string, value: string) => {
//   const updated = { ...formData, [field]: value }
//   const waist = field === "waist" ? value : formData.waist
//   const hip = field === "hip" ? value : formData.hip
//   updated.whr = calculateWHR(waist || "", hip || "")
//   setFormData(updated)
//   onUpdate(updated)
//   }


//   const handleHeightWeightChange = (field: string, value: string) => {
//     const updated = { ...formData, [field]: value }
//     if (field === "height" || field === "weight") {
//       const height = field === "height" ? value : formData.height
//       const weight = field === "weight" ? value : formData.weight
//       updated.bmi = calculateBMI(height || "", weight || "")
//     }
//     setFormData(updated)
//     onUpdate(updated)
//   }

//   return (
//     <div className="space-y-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 p-6 rounded-2xl shadow-xl border border-slate-200/50">
//       <Card className="border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white/95 backdrop-blur-sm overflow-hidden !mt-0">
//         <CardHeader
//           className="px-6 py-5 !pt-4 !mt-0 rounded-t-2xl border-b border-blue-300/50
//                      bg-gradient-to-r from-[#0A2A5A] to-[#1e40af] relative overflow-hidden"
//         >
//           {/* Enhanced Neon moving beam with softer glow */}
//           <div className="absolute inset-0 bg-gradient-to-r 
//                           from-transparent via-cyan-400/30 to-transparent
//                           animate-[neon_5s_ease-in-out_infinite]" />
//           <CardTitle className="relative z-10 text-xl font-bold 
//                                 text-cyan-50 drop-shadow-[0_0_6px_#06b6d4] tracking-tight">
//             Clinical Assessments
//           </CardTitle>
//           <CardDescription className="relative z-10 text-base 
//                                       text-cyan-100/95 drop-shadow-[0_0_4px_#06b6d4] mt-1">
//             Physical measurements and vital signs
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             {/* Height */}
//             <div className="space-y-3">
//               <Label htmlFor="height" className="text-slate-800 font-semibold text-sm tracking-wide">
//                 Height (cm) *
//               </Label>
//               <Input
//                 id="height"
//                 type="number"
//                 placeholder="Enter height in cm"
//                 value={formData.height || ""}
//                 onChange={(e) => handleHeightWeightChange("height", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                 required
//               />
//             </div>

//             {/* Weight */}
//             <div className="space-y-3">
//               <Label htmlFor="weight" className="text-slate-800 font-semibold text-sm tracking-wide">
//                 Weight (kg) *
//               </Label>
//               <Input
//                 id="weight"
//                 type="number"
//                 placeholder="Enter weight in kg"
//                 value={formData.weight || ""}
//                 onChange={(e) => handleHeightWeightChange("weight", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                 required
//               />
//             </div>

//             {/* BMI */}
//             <div className="space-y-3">
//               <Label htmlFor="bmi" className="text-slate-800 font-semibold text-sm tracking-wide">
//                 BMI (Auto-calculated)
//               </Label>
//               <Input
//                 id="bmi"
//                 type="number"
//                 placeholder="BMI will be calculated"
//                 value={formData.bmi || ""}
//                 readOnly
//                 className="border-slate-300/70 bg-gradient-to-r from-slate-100 to-blue-50/30 shadow-md cursor-not-allowed rounded-xl"
//               />
//             </div>

//             {/* Pulse */}
//             <div className="space-y-3">
//               <Label htmlFor="pulse" className="text-slate-800 font-semibold text-sm tracking-wide">Pulse (per min)</Label>
//               <Input
//                 id="pulse"
//                 type="number"
//                 placeholder="Enter pulse"
//                 value={formData.pulse || ""}
//                 onChange={(e) => handleChange("pulse", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* HRV */}
//             <div className="space-y-3">
//               <Label htmlFor="hrv" className="text-slate-800 font-semibold text-sm tracking-wide">Heart Rate Variability (ms)</Label>
//               <Input
//                 id="hrv"
//                 type="number"
//                 placeholder="Enter heart rate variability"
//                 value={formData.hrv || ""}
//                 onChange={(e) => handleChange("hrv", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Heart Rate */}
//             <div className="space-y-3">
//               <Label htmlFor="heartRate" className="text-slate-800 font-semibold text-sm tracking-wide">
//                 Heart Rate (bpm)
//               </Label>
//               <Input
//                 id="heartRate"
//                 type="number"
//                 placeholder="Enter heart rate"
//                 value={formData.heartRate || ""}
//                 onChange={(e) => handleChange("heartRate", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Systolic BP */}
//             <div className="space-y-3">
//               <Label htmlFor="systolicBP" className="text-slate-800 font-semibold text-sm tracking-wide">
//                 Systolic BP (mmHg)
//               </Label>
//               <Input
//                 id="systolicBP"
//                 type="number"
//                 placeholder="Enter systolic BP"
//                 value={formData.systolicBP || ""}
//                 onChange={(e) => handleChange("systolicBP", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Diastolic BP */}
//             <div className="space-y-3">
//               <Label htmlFor="diastolicBP" className="text-slate-800 font-semibold text-sm tracking-wide">
//                 Diastolic BP (mmHg)
//               </Label>
//               <Input
//                 id="diastolicBP"
//                 type="number"
//                 placeholder="Enter diastolic BP"
//                 value={formData.diastolicBP || ""}
//                 onChange={(e) => handleChange("diastolicBP", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Blood Glucose */}
//             <div className="space-y-3">
//               <Label htmlFor="bloodGlucose" className="text-slate-800 font-semibold text-sm tracking-wide">
//                 Fasting Blood Glucose (mg/dL)
//               </Label>
//               <Input
//                 id="bloodGlucose"
//                 type="number"
//                 placeholder="Enter fasting blood glucose"
//                 value={formData.bloodGlucose || ""}
//                 onChange={(e) => handleChange("bloodGlucose", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//             {/* Body Circumference & Composition */}
//       <Card className="border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white/95 backdrop-blur-sm overflow-hidden !mt-0">
//         <CardHeader
//           className="px-6 py-5 !pt-4 !mt-0 rounded-t-2xl border-b border-blue-300/50
//                      bg-gradient-to-r from-[#0A2A5A] to-[#1e40af] relative overflow-hidden"
//         >
//           {/* Enhanced Neon moving beam with softer glow */}
//           <div className="absolute inset-0 bg-gradient-to-r 
//                           from-transparent via-cyan-400/30 to-transparent
//                           animate-[neon_5s_ease-in-out_infinite]" />
//           <CardTitle className="relative z-10 text-xl font-bold 
//                                 text-cyan-50 drop-shadow-[0_0_6px_#06b6d4] tracking-tight">
//             Body Circumference & Composition
//           </CardTitle>
//           <CardDescription className="relative z-10 text-base 
//                                       text-cyan-100/95 drop-shadow-[0_0_4px_#06b6d4] mt-1">
//             Waist, hip ratio and body composition metrics
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

//             {/* Waist */}
//             <div className="space-y-3">
//               <Label htmlFor="waist" className="text-slate-800 font-semibold text-sm tracking-wide">Waist (cm)</Label>
//               <Input
//                 id="waist"
//                 type="number"
//                 placeholder="Enter waist circumference"
//                 value={formData.waist || ""}
//                 onChange={(e) => handleWaistHipChange("waist", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Hip */}
//             <div className="space-y-3">
//               <Label htmlFor="hip" className="text-slate-800 font-semibold text-sm tracking-wide">Hip (cm)</Label>
//               <Input
//                 id="hip"
//                 type="number"
//                 placeholder="Enter hip circumference"
//                 value={formData.hip || ""}
//                 onChange={(e) => handleWaistHipChange("hip", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* WHR */}
//             <div className="space-y-3">
//               <Label htmlFor="whr" className="text-slate-800 font-semibold text-sm tracking-wide">Waist-Hip Ratio (Auto-Calculated)</Label>
//               <Input
//                 id="whr"
//                 type="number"
//                 value={formData.whr || ""}
//                 readOnly
//                 className="border-slate-300/70 bg-gradient-to-r from-slate-100 to-blue-50/30 shadow-md cursor-not-allowed rounded-xl"
//               />
//             </div>

//             {/* NEW: Body Age */}
//             <div className="space-y-3">
//               <Label htmlFor="bodyAge" className="text-slate-800 font-semibold text-sm tracking-wide">Body Age</Label>
//               <Input
//                 id="bodyAge"
//                 type="number"
//                 value={formData.bodyAge || ""}
//                 onChange={(e) => handleChange("bodyAge", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Body Fat % */}
//             <div className="space-y-3">
//               <Label className="text-slate-800 font-semibold text-sm tracking-wide">Body Fat (%)</Label>
//               <Input
//                 type="number"
//                 value={formData.bodyFat || ""}
//                 onChange={(e) => handleChange("bodyFat", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Visceral Fat % */}
//             <div className="space-y-3">
//               <Label className="text-slate-800 font-semibold text-sm tracking-wide">Visceral Fat (%)</Label>
//               <Input
//                 type="number"
//                 value={formData.visceralFat || ""}
//                 onChange={(e) => handleChange("visceralFat", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Subcutaneous Fat % */}
//             <div className="space-y-3">
//               <Label className="text-slate-800 font-semibold text-sm tracking-wide">Subcutaneous Fat (%)</Label>
//               <Input
//                 type="number"
//                 value={formData.subcutFat || ""}
//                 onChange={(e) => handleChange("subcutFat", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Muscle Mass % */}
//             <div className="space-y-3">
//               <Label className="text-slate-800 font-semibold text-sm tracking-wide">Muscle Mass (%)</Label>
//               <Input
//                 type="number"
//                 value={formData.muscleMass || ""}
//                 onChange={(e) => handleChange("muscleMass", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//             {/* Resting Metabolism */}
//             <div className="space-y-3">
//               <Label className="text-slate-800 font-semibold text-sm tracking-wide">Resting Metabolism (kCal)</Label>
//               <Input
//                 type="number"
//                 value={formData.restingMetabolism || ""}
//                 onChange={(e) => handleChange("restingMetabolism", e.target.value)}
//                 className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//               />
//             </div>

//           </div>
//         </CardContent>
//       </Card>


//       {/* Medical History */}
//       <Card className="border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white/95 backdrop-blur-sm overflow-hidden !mt-0">
//         <CardHeader
//           className="px-6 py-5 !pt-4 !mt-0 rounded-t-2xl border-b border-blue-300/50
//                      bg-gradient-to-r from-[#0A2A5A] to-[#1e40af] relative overflow-hidden"
//         >
//           {/* Enhanced Neon moving beam with softer glow */}
//           <div className="absolute inset-0 bg-gradient-to-r 
//                           from-transparent via-cyan-400/30 to-transparent
//                           animate-[neon_5s_ease-in-out_infinite]" />
//           <CardTitle className="relative z-10 text-xl font-bold 
//                                 text-cyan-50 drop-shadow-[0_0_6px_#06b6d4] tracking-tight">
//             Medical History
//           </CardTitle>
//           <CardDescription className="relative z-10 text-base 
//                                       text-cyan-100/95 drop-shadow-[0_0_4px_#06b6d4] mt-1">
//             Current and past medical conditions
//           </CardDescription>
//         </CardHeader>
//           <CardContent className="p-6 space-y-6">
//             {/* Present complaints */}
//           <div className="space-y-3">
//             <Label className="text-slate-800 font-semibold text-sm tracking-wide">Present Complaints</Label>
//             <Input
//               value={formData.presentComplaint || ""}
//               onChange={(e) => handleChange("presentComplaint", e.target.value)}
//               className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//             />
//           </div>

//           {/* Current meds/supplements */}
//           <div className="space-y-3">
//             <Label className="text-slate-800 font-semibold text-sm tracking-wide">Current Medications / Supplements</Label>
//             <Input
//               value={formData.currentMeds || ""}
//               onChange={(e) => handleChange("currentMeds", e.target.value)}
//               className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//             />
//           </div>

//           {/* Had Covid */}
//           <div className="space-y-3">
//             <Label className="text-slate-800 font-semibold text-sm tracking-wide">Have you had Covid?</Label>
//             <RadioGroup
//               value={formData.hadCovid || ""}
//               onValueChange={(value) => handleChange("hadCovid", value)}
//               className="grid grid-cols-2 gap-3"
//             >
//               {["yes", "no"].map(v => (
//                 <div key={v} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/30 hover:border-blue-300/50 hover:shadow-sm transition-all duration-200 cursor-pointer">
//                   <RadioGroupItem
//                     value={v}
//                     id={v}
//                     className="border-2 h-5 w-5 text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500/50"
//                   />
//                   <Label htmlFor={v} className="text-slate-700 capitalize font-medium text-sm">
//                     {v}
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>

//           {/* Vaccine multi-select */}
//           <div className="space-y-3">
//             <Label className="text-slate-800 font-semibold text-sm tracking-wide">Vaccine History</Label>
//             {["1st dose", "2nd dose", "booster"].map(v => (
//               <div key={v} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/30 hover:border-blue-300/50 hover:shadow-sm transition-all duration-200 cursor-pointer">
//                 <Checkbox
//                   checked={formData.vaccineHistory?.includes(v)}
//                   onCheckedChange={(checked) => {
//                     let updated = formData.vaccineHistory || []
//                     if (checked) updated = [...updated, v]
//                     else updated = updated.filter(i => i !== v)
//                     handleChange("vaccineHistory", updated)
//                   }}
//                   className="border-2 h-5 w-5"
//                 />
//                 <Label className="text-slate-700 font-medium text-sm">
//                   {v}
//                 </Label>
//               </div>
//             ))}
//           </div>

//         </CardContent>
//       </Card>

//        {/* FAMILY HISTORY CARD */}
//       <Card className="border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl bg-white/95 backdrop-blur-sm overflow-hidden !mt-0">
//         <CardHeader
//           className="px-6 py-5 !pt-4 !mt-0 rounded-t-2xl border-b border-blue-300/50
//                      bg-gradient-to-r from-[#0A2A5A] to-[#1e40af] relative overflow-hidden"
//         >
//           {/* Enhanced Neon moving beam with softer glow */}
//           <div className="absolute inset-0 bg-gradient-to-r 
//                           from-transparent via-cyan-400/30 to-transparent
//                           animate-[neon_5s_ease-in-out_infinite]" />
//           <CardTitle className="relative z-10 text-xl font-bold 
//                                 text-cyan-50 drop-shadow-[0_0_6px_#06b6d4] tracking-tight">
//             Family History
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 space-y-6">

//               {/* Obesity */}
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/30 hover:border-blue-300/50 hover:shadow-sm transition-all duration-200 cursor-pointer">
//                   <Checkbox
//                     id="familyObesity"
//                     checked={formData.familyHistoryObesity === "yes"}
//                     onCheckedChange={(checked) =>
//                       handleChange("familyHistoryObesity", checked ? "yes" : "no")
//                     }
//                     className="border-2 h-5 w-5"
//                   />
//                   <Label htmlFor="familyObesity" className="font-normal cursor-pointer text-slate-700 text-sm font-medium">
//                     Obesity in family
//                   </Label>
//                 </div>

//                 {formData.familyHistoryObesity === "yes" && (
//                   <div className="space-y-3 pl-8">
//                     <Input
//                       type="text"
//                       placeholder="Who? (e.g., Mother, Father, Sibling)"
//                       className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                       value={formData.familyHistoryObesityDetails || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryObesityDetails", e.target.value)
//                       }
//                     />

//                     <Input
//                       type="number"
//                       min="0"
//                       placeholder="Duration (years)"
//                       className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                       value={formData.familyHistoryObesityDuration || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryObesityDuration", e.target.value)
//                       }
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Diabetes */}
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/30 hover:border-blue-300/50 hover:shadow-sm transition-all duration-200 cursor-pointer">
//                   <Checkbox
//                     id="familyDiabetes"
//                     checked={formData.familyHistoryDiabetes === "yes"}
//                     onCheckedChange={(checked) =>
//                       handleChange("familyHistoryDiabetes", checked ? "yes" : "no")
//                     }
//                     className="border-2 h-5 w-5"
//                   />
//                   <Label htmlFor="familyDiabetes" className="font-normal cursor-pointer text-slate-700 text-sm font-medium">
//                     Diabetes in family
//                   </Label>
//                 </div>

//                 {formData.familyHistoryDiabetes === "yes" && (
//                   <div className="space-y-3 pl-8">
//                     <Input
//                       type="text"
//                       placeholder="Who? (e.g., Mother, Father, Sibling)"
//                       className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                       value={formData.familyHistoryDiabetesDetails || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryDiabetesDetails", e.target.value)
//                       }
//                     />

//                     <Input
//                       type="number"
//                       min="0"
//                       placeholder="Duration (years)"
//                       className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                       value={formData.familyHistoryDiabetesDuration || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryDiabetesDuration", e.target.value)
//                       }
//                     />
//                   </div>
//                 )}
//               </div>

//                 {/* Hypertension */}
//               <div className="space-y-3">
//                 <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50/30 hover:border-blue-300/50 hover:shadow-sm transition-all duration-200 cursor-pointer">
//                   <Checkbox
//                     id="familyHypertension"
//                     checked={formData.familyHistoryHypertension === "yes"}
//                     onCheckedChange={(checked) =>
//                       handleChange("familyHistoryHypertension", checked ? "yes" : "no")
//                     }
//                     className="border-2 h-5 w-5"
//                   />
//                   <Label htmlFor="familyHypertension" className="font-normal cursor-pointer text-slate-700 text-sm font-medium">
//                     Hypertension in family
//                   </Label>
//                 </div>

//                 {formData.familyHistoryHypertension === "yes" && (
//                   <div className="space-y-3 pl-8">
//                     <Input
//                       type="text"
//                       placeholder="Who? (e.g., Mother, Father, Sibling)"
//                       className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                       value={formData.familyHistoryHypertensionDetails || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryHypertensionDetails", e.target.value)
//                       }
//                     />

//                     <Input
//                       type="number"
//                       min="0"
//                       placeholder="Duration (years)"
//                       className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                       value={formData.familyHistoryHypertensionDuration || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryHypertensionDuration", e.target.value)
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//               <div>
              
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-3">
//                   <Label className="text-slate-800 font-semibold text-sm tracking-wide">Chronicity</Label>
//                   <Input
//                     name="familyChronicity"
//                     onChange={(e) => handleChange("familyChronicity", e.target.value)}
//                     placeholder="chronic / acute / recurring"
//                     className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <Label className="text-slate-800 font-semibold text-sm tracking-wide">Measures Taken</Label>
//                   <Input
//                     name="familyMeasuresTaken"
//                     onChange={(e) => handleChange("familyMeasuresTaken", e.target.value)}
//                     placeholder="exercise / diet / treatment..."
//                     className="border-slate-300/70 bg-white/80 shadow-md hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl transition-all duration-200"
//                   />
//                 </div>
//                 </div>

//         </CardContent>
//       </Card>

//     </div>
//   )
// }          
// .................................................................. original below
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Checkbox } from "@/components/ui/checkbox"

// interface ClinicalAssessmentData {
//   height?: string
//   weight?: string
//   bmi?: string
//   systolicBP?: string
//   diastolicBP?: string
//   heartRate?: string
//   pulse?: string
//   hrv?: string
//   bloodGlucose?: string
//   waist?: string
//   hip?: string
//   whr?: string
//   bodyFat?: string
//   visceralFat?: string
//   subcutFat?: string
//   muscleMass?: string
//   restingMetabolism?: string
//   bodyAge?: string
//   presentComplaint?: string
//   currentMeds?: string
//   hadCovid?: string
//   vaccineHistory?: string[]
//   familyHistoryObesity?: string
//   familyHistoryDiabetes?: string
//   familyHistoryObesityDuration?: string
//   familyHistoryObesityDetails?: string
//   familyHistoryDiabetesDetails?: string
//   familyHistoryDiabetesDuration?: string
//   medications?: string
//   familyHistoryHypertension?: string
//   familyHistoryHypertensionDuration?: string
//   familyHistoryHypertensionDetails?: string
// }

// interface ClinicalAssessmentFormProps {
//   data: ClinicalAssessmentData
//   onUpdate: (data: ClinicalAssessmentData) => void
// }

// export default function ClinicalAssessmentForm({ data, onUpdate }: ClinicalAssessmentFormProps) {
//   const [formData, setFormData] = useState<ClinicalAssessmentData>(data || {})

//     // ⬇️ SCROLL TO TOP WHEN COMPONENT LOADS ⬇️
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     setFormData(data || {})
//   }, [data])

//   const handleChange = (field: string, value: any) => {
//     const updated = { ...formData, [field]: value }
//     setFormData(updated)
//     onUpdate(updated)
//   }

//   const calculateBMI = (height: string, weight: string) => {
//     if (height && weight) {
//       const h = Number.parseFloat(height) / 100
//       const w = Number.parseFloat(weight)
//       const bmi = (w / (h * h)).toFixed(2)
//       return bmi
//     }
//     return ""
//   }

//   const calculateWHR = (waist: string, hip: string) => {
//   if (waist && hip) {
//     const w = Number.parseFloat(waist)
//     const h = Number.parseFloat(hip)
//     if (h > 0) return (w / h).toFixed(2)
//   }
//   return ""
//   }

//   const handleWaistHipChange = (field: string, value: string) => {
//   const updated = { ...formData, [field]: value }
//   const waist = field === "waist" ? value : formData.waist
//   const hip = field === "hip" ? value : formData.hip
//   updated.whr = calculateWHR(waist || "", hip || "")
//   setFormData(updated)
//   onUpdate(updated)
//   }


//   const handleHeightWeightChange = (field: string, value: string) => {
//     const updated = { ...formData, [field]: value }
//     if (field === "height" || field === "weight") {
//       const height = field === "height" ? value : formData.height
//       const weight = field === "weight" ? value : formData.weight
//       updated.bmi = calculateBMI(height || "", weight || "")
//     }
//     setFormData(updated)
//     onUpdate(updated)
//   }

//   return (
//     <div className="space-y-6">
//       <Card className="border-slate-200">
//         <CardHeader className="bg-slate-50 border-b border-slate-200">
//           <CardTitle className="text-lg text-slate-900">Clinical Assessments</CardTitle>
//           <CardDescription className="text-slate-600">Physical measurements and vital signs</CardDescription>
//         </CardHeader>
//         <CardContent className="pt-6">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//             {/* Height */}
//             <div className="space-y-2">
//               <Label htmlFor="height" className="text-slate-700 font-medium">
//                 Height (cm) *
//               </Label>
//               <Input
//                 id="height"
//                 type="number"
//                 placeholder="Enter height in cm"
//                 value={formData.height || ""}
//                 onChange={(e) => handleHeightWeightChange("height", e.target.value)}
//                 className="border-slate-300"
//                 required
//               />
//             </div>

//             {/* Weight */}
//             <div className="space-y-2">
//               <Label htmlFor="weight" className="text-slate-700 font-medium">
//                 Weight (kg) *
//               </Label>
//               <Input
//                 id="weight"
//                 type="number"
//                 placeholder="Enter weight in kg"
//                 value={formData.weight || ""}
//                 onChange={(e) => handleHeightWeightChange("weight", e.target.value)}
//                 className="border-slate-300"
//                 required
//               />
//             </div>

//             {/* BMI */}
//             <div className="space-y-2">
//               <Label htmlFor="bmi" className="text-slate-700 font-medium">
//                 BMI (Auto-calculated)
//               </Label>
//               <Input
//                 id="bmi"
//                 type="number"
//                 placeholder="BMI will be calculated"
//                 value={formData.bmi || ""}
//                 readOnly
//                 className="border-slate-300 bg-slate-50"
//               />
//             </div>

//             {/* Pulse */}
//             <div className="space-y-2">
//               <Label htmlFor="pulse" className="text-slate-700 font-medium">Pulse (per min)</Label>
//               <Input
//                 id="pulse"
//                 type="number"
//                 placeholder="Enter pulse"
//                 value={formData.pulse || ""}
//                 onChange={(e) => handleChange("pulse", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* HRV */}
//             <div className="space-y-2">
//               <Label htmlFor="hrv" className="text-slate-700 font-medium">Heart Rate Variability (ms)</Label>
//               <Input
//                 id="hrv"
//                 type="number"
//                 placeholder="Enter heart rate variability"
//                 value={formData.hrv || ""}
//                 onChange={(e) => handleChange("hrv", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* Heart Rate */}
//             <div className="space-y-2">
//               <Label htmlFor="heartRate" className="text-slate-700 font-medium">
//                 Heart Rate (bpm)
//               </Label>
//               <Input
//                 id="heartRate"
//                 type="number"
//                 placeholder="Enter heart rate"
//                 value={formData.heartRate || ""}
//                 onChange={(e) => handleChange("heartRate", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* Systolic BP */}
//             <div className="space-y-2">
//               <Label htmlFor="systolicBP" className="text-slate-700 font-medium">
//                 Systolic BP (mmHg)
//               </Label>
//               <Input
//                 id="systolicBP"
//                 type="number"
//                 placeholder="Enter systolic BP"
//                 value={formData.systolicBP || ""}
//                 onChange={(e) => handleChange("systolicBP", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* Diastolic BP */}
//             <div className="space-y-2">
//               <Label htmlFor="diastolicBP" className="text-slate-700 font-medium">
//                 Diastolic BP (mmHg)
//               </Label>
//               <Input
//                 id="diastolicBP"
//                 type="number"
//                 placeholder="Enter diastolic BP"
//                 value={formData.diastolicBP || ""}
//                 onChange={(e) => handleChange("diastolicBP", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* Blood Glucose */}
//             <div className="space-y-2">
//               <Label htmlFor="bloodGlucose" className="text-slate-700 font-medium">
//                 Fasting Blood Glucose (mg/dL)
//               </Label>
//               <Input
//                 id="bloodGlucose"
//                 type="number"
//                 placeholder="Enter fasting blood glucose"
//                 value={formData.bloodGlucose || ""}
//                 onChange={(e) => handleChange("bloodGlucose", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//             {/* Body Circumference & Composition */}
//       <Card className="border-slate-200">
//         <CardHeader className="bg-slate-50 border-b border-slate-200">
//           <CardTitle className="text-lg text-slate-900">Body Circumference & Composition</CardTitle>
//           <CardDescription className="text-slate-600">Waist, hip ratio and body composition metrics</CardDescription>
//         </CardHeader>
//         <CardContent className="pt-6">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

//             {/* Waist */}
//             <div className="space-y-2">
//               <Label htmlFor="waist" className="text-slate-700 font-medium">Waist (cm)</Label>
//               <Input
//                 id="waist"
//                 type="number"
//                 placeholder="Enter waist circumference"
//                 value={formData.waist || ""}
//                 onChange={(e) => handleWaistHipChange("waist", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* Hip */}
//             <div className="space-y-2">
//               <Label htmlFor="hip" className="text-slate-700 font-medium">Hip (cm)</Label>
//               <Input
//                 id="hip"
//                 type="number"
//                 placeholder="Enter hip circumference"
//                 value={formData.hip || ""}
//                 onChange={(e) => handleWaistHipChange("hip", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* WHR */}
//             <div className="space-y-2">
//               <Label htmlFor="whr" className="text-slate-700 font-medium">Waist-Hip Ratio (Auto-Calculated)</Label>
//               <Input
//                 id="whr"
//                 type="number"
//                 value={formData.whr || ""}
//                 readOnly
//                 className="border-slate-300 bg-slate-50"
//               />
//             </div>

//             {/* NEW: Body Age */}
//             <div className="space-y-2">
//               <Label htmlFor="bodyage" className="text-slate-700 font-medium">Body Age</Label>
//               <Input
//                 id="whr"
//                 type="number"
//                 value={formData.bodyAge || ""}
//                 onChange={(e) => handleChange("bodyAge", e.target.value)}
//                 className="border-slate-300 bg-slate-50"
//               />
//             </div>

//             {/* Body Fat % */}
//             <div className="space-y-2">
//               <Label className="text-slate-700 font-medium">Body Fat (%)</Label>
//               <Input
//                 type="number"
//                 value={formData.bodyFat || ""}
//                 onChange={(e) => handleChange("bodyFat", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* Visceral Fat % */}
//             <div className="space-y-2">
//               <Label className="text-slate-700 font-medium">Visceral Fat (%)</Label>
//               <Input
//                 type="number"
//                 value={formData.visceralFat || ""}
//                 onChange={(e) => handleChange("visceralFat", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* Subcutaneous Fat % */}
//             <div className="space-y-2">
//               <Label className="text-slate-700 font-medium">Subcutaneous Fat (%)</Label>
//               <Input
//                 type="number"
//                 value={formData.subcutFat || ""}
//                 onChange={(e) => handleChange("subcutFat", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* Muscle Mass % */}
//             <div className="space-y-2">
//               <Label className="text-slate-700 font-medium">Muscle Mass (%)</Label>
//               <Input
//                 type="number"
//                 value={formData.muscleMass || ""}
//                 onChange={(e) => handleChange("muscleMass", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//             {/* Resting Metabolism */}
//             <div className="space-y-2">
//               <Label className="text-slate-700 font-medium">Resting Metabolism (kCal)</Label>
//               <Input
//                 type="number"
//                 value={formData.restingMetabolism || ""}
//                 onChange={(e) => handleChange("restingMetabolism", e.target.value)}
//                 className="border-slate-300"
//               />
//             </div>

//           </div>
//         </CardContent>
//       </Card>


//       {/* Medical History */}
//       <Card className="border-slate-200">
//         <CardHeader className="bg-slate-50 border-b border-slate-200">
//           <CardTitle className="text-lg text-slate-900">Medical History</CardTitle>
//           <CardDescription className="text-slate-600">Current and past medical conditions</CardDescription>
//         </CardHeader>
//           <CardContent className="pt-6 space-y-6">
//             {/* Present complaints */}
//           <div className="space-y-2">
//             <Label>Present Complaints</Label>
//             <Input
//               value={formData.presentComplaint || ""}
//               onChange={(e) => handleChange("presentComplaint", e.target.value)}
//               className="border-slate-300 bg-slate-50"
//             />
//           </div>

//           {/* Current meds/supplements */}
//           <div className="space-y-2">
//             <Label>Current Medications / Supplements</Label>
//             <Input
//               value={formData.currentMeds || ""}
//               onChange={(e) => handleChange("currentMeds", e.target.value)}
//               className="border-slate-300 bg-slate-50"
//             />
//           </div>

//           {/* Had Covid */}
//           <div className="space-y-3">
//             <Label>Have you had Covid?</Label>
//             <RadioGroup
//               value={formData.hadCovid || ""}
//               onValueChange={(value) => handleChange("hadCovid", value)}
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="yes" />
//                 <Label>Yes</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="no" />
//                 <Label>No</Label>
//               </div>
//             </RadioGroup>
//           </div>

//           {/* Vaccine multi-select */}
//           <div className="space-y-3">
//             <Label>Vaccine History</Label>
//             {["1st dose", "2nd dose", "booster"].map(v => (
//               <div key={v} className="flex items-center space-x-2">
//                 <Checkbox
//                   checked={formData.vaccineHistory?.includes(v)}
//                   onCheckedChange={(checked) => {
//                     let updated = formData.vaccineHistory || []
//                     if (checked) updated = [...updated, v]
//                     else updated = updated.filter(i => i !== v)
//                     handleChange("vaccineHistory", updated)
//                   }}
//                 />
//                 <Label>{v}</Label>
//               </div>
//             ))}
//           </div>

//         </CardContent>
//       </Card>

//        {/* FAMILY HISTORY CARD */}
//       <Card className="border-slate-200">
//         <CardHeader className="bg-slate-50 border-b border-slate-200">
//           <CardTitle>Family History</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">

//               {/* Obesity */}
//               <div className="space-y-2">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="familyObesity"
//                     checked={formData.familyHistoryObesity === "yes"}
//                     onCheckedChange={(checked) =>
//                       handleChange("familyHistoryObesity", checked ? "yes" : "no")
//                     }
//                   />
//                   <Label htmlFor="familyObesity" className="font-normal cursor-pointer text-slate-700">
//                     Obesity in family
//                   </Label>
//                 </div>

//                 {formData.familyHistoryObesity === "yes" && (
//                   <div className="space-y-2">
//                     <input
//                       type="text"
//                       placeholder="Who? (e.g., Mother, Father, Sibling)"
//                       className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={formData.familyHistoryObesityDetails || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryObesityDetails", e.target.value)
//                       }
//                     />

//                     <input
//                       type="number"
//                       min="0"
//                       placeholder="Duration (years)"
//                       className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={formData.familyHistoryObesityDuration || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryObesityDuration", e.target.value)
//                       }
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Diabetes */}
//               <div className="space-y-2">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="familyDiabetes"
//                     checked={formData.familyHistoryDiabetes === "yes"}
//                     onCheckedChange={(checked) =>
//                       handleChange("familyHistoryDiabetes", checked ? "yes" : "no")
//                     }
//                   />
//                   <Label htmlFor="familyDiabetes" className="font-normal cursor-pointer text-slate-700">
//                     Diabetes in family
//                   </Label>
//                 </div>

//                 {formData.familyHistoryDiabetes === "yes" && (
//                   <div className="space-y-2">
//                     <input
//                       type="text"
//                       placeholder="Who? (e.g., Mother, Father, Sibling)"
//                       className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={formData.familyHistoryDiabetesDetails || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryDiabetesDetails", e.target.value)
//                       }
//                     />

//                     <input
//                       type="number"
//                       min="0"
//                       placeholder="Duration (years)"
//                       className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={formData.familyHistoryDiabetesDuration || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryDiabetesDuration", e.target.value)
//                       }
//                     />
//                   </div>
//                 )}
//               </div>

//                 {/* Hypertension */}
//               <div className="space-y-2">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="familyHypertension"
//                     checked={formData.familyHistoryHypertension === "yes"}
//                     onCheckedChange={(checked) =>
//                       handleChange("familyHistoryHypertension", checked ? "yes" : "no")
//                     }
//                   />
//                   <Label htmlFor="familyHypertension" className="font-normal cursor-pointer text-slate-700">
//                     Hypertension in family
//                   </Label>
//                 </div>

//                 {formData.familyHistoryHypertension === "yes" && (
//                   <div className="space-y-2">
//                     <input
//                       type="text"
//                       placeholder="Who? (e.g., Mother, Father, Sibling)"
//                       className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={formData.familyHistoryHypertensionDetails || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryHypertensionDetails", e.target.value)
//                       }
//                     />

//                     <input
//                       type="number"
//                       min="0"
//                       placeholder="Duration (years)"
//                       className="border border-slate-300 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={formData.familyHistoryObesityDuration || ""}
//                       onChange={(e) =>
//                         handleChange("familyHistoryObesityDuration", e.target.value)
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//               <div>
              
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <Label>Chronicity</Label>
//                   <div className="space-y-2 pt-2">
//                   <Input
//                     name="familyChronicity"
//                     onChange={(e) => handleChange("familyChronicity", e.target.value)}
//                     placeholder="chronic / acute / recurring"
//                     className="border-slate-300 bg-slate-50"
//                   />
//                   </div>
//                 </div>

//                 <div>
//                   <Label>Measures Taken</Label>
//                   <div className="space-y-2 pt-2">
//                   <Input
//                     name="familyMeasuresTaken"
//                     onChange={(e) => handleChange("familyMeasuresTaken", e.target.value)}
//                     placeholder="exercise / diet / treatment..."
//                     className="border-slate-300 bg-slate-50"
//                   />
//                 </div>
//                 </div>
//               </div>

//             </CardContent>
//       </Card>

//     </div>
//   )
// }
