"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"


interface FrequencyMap {
  [key: string]: string
}

interface ActivityRow {
  frequency: string | null
  intensity: string | null
}

export interface LifestyleValues {
  // Stress (PSS-10)
  pss_q1: string | null
  pss_q2: string | null
  pss_q3: string | null
  pss_q4: string | null
  pss_q5: string | null
  pss_q6: string | null
  pss_q7: string | null
  pss_q8: string | null
  pss_q9: string | null
  pss_q10: string | null
  totalPSS10: number | null

  sleepHours: string | null
  sleepQuality: string | null
  peakActiveHours: string[] | null // Morning / Afternoon / Evening / Night
  screenMobile: string | null
  screenLaptop: string | null
  screenOther: string | null
  dailySleepNight: string | null
  dailySleepDay: string | null
  sleepQualityDetailed: string | null // Poor / Moderate / Good / Interrupted
  occupation: string | null
  travellingForWork: string | null

  workType: string | null
  exerciseFrequency: string | null
  exerciseDuration: string | null
  dietType: string | null
  // fruitsVegetablesDaily: string | null
  // waterIntake: string | null
  // alcoholConsumption: string | null
  // smokingStatus: string | null
  stressLevel: string | null
  selfDefinedStressLevel: string | null
  screenTime: string | null

  regularity: {
    wakingTimings: string | null
    sleepTimings: string | null
    mealTimings: string | null
    exercise: string | null
  }

  // Structured sections
  dietFrequencies: FrequencyMap
  addictionFrequencies: FrequencyMap
  physicalActivity: {
    neat?: ActivityRow
    aerobic?: ActivityRow
    anaerobic?: ActivityRow
  }
}

const DEFAULT_LIFESTYLE: LifestyleValues = {
  pss_q1: null,
  pss_q2: null,
  pss_q3: null,
  pss_q4: null,
  pss_q5: null,
  pss_q6: null,
  pss_q7: null,
  pss_q8: null,
  pss_q9: null,
  pss_q10: null,
  totalPSS10: null,

  sleepHours: null,
  sleepQuality: null,
  dailySleepNight: null,
  dailySleepDay: null,
  sleepQualityDetailed: null,
  exerciseFrequency: null,
  exerciseDuration: null,
  dietType: null,
  // fruitsVegetablesDaily: null,
  // waterIntake: null,
  // alcoholConsumption: null,
  // smokingStatus: null,
  stressLevel: null,
  selfDefinedStressLevel: null,
  screenTime: null,
  workType: null,

  screenMobile: null,
  screenLaptop: null,
  screenOther: null,

  occupation: null,
  travellingForWork: null,
  peakActiveHours: [],

  dietFrequencies: {},
  addictionFrequencies: {},
  physicalActivity: {
    neat: { frequency: null, intensity: null },
    aerobic: { frequency: null, intensity: null },
    anaerobic: { frequency: null, intensity: null },
  },

  regularity: {
    wakingTimings: null,
    sleepTimings: null,
    mealTimings: null,
    exercise: null,
  },
}


interface LifestyleFormProps {
  data?: { values?: Partial<LifestyleValues> }
  onUpdate?: (data: LifestyleValues) => void
}

/* -------------------------------------------------- */

export default function LifestyleForm({ data, onUpdate }: LifestyleFormProps) {
  const [formData, setFormData] = useState<LifestyleValues>({
    ...DEFAULT_LIFESTYLE,
    ...(data?.values || {}),
  })

  // ⬇️ SCROLL TO TOP WHEN COMPONENT LOADS ⬇️
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ---------------- Sync from parent ---------------- */
  useEffect(() => {
    if (!data?.values) return
    setFormData({
      ...DEFAULT_LIFESTYLE,
      ...data.values,
    })
  }, [data?.values])

//   const hydratedRef = useRef(false)

// useEffect(() => {
//   if (hydratedRef.current) return
//   if (!data?.values) return

//   setFormData(prev => ({
//     ...prev,
//     ...data.values,
//   }))

//   hydratedRef.current = true
// }, [data?.values])

  /* ---------------- Push to parent ---------------- */
// const pushUpdate = (
//   updater: LifestyleValues | ((prev: LifestyleValues) => LifestyleValues)
// ) => {
//   setFormData(prev => {
//     const updated =
//       typeof updater === "function"
//         ? updater(prev)
//         : updater

//     onUpdate?.(updated) // Pass the updated object directly
//     return updated
//   })
// }

const pushUpdate = (
  updater: LifestyleValues | ((prev: LifestyleValues) => LifestyleValues)
) => {
  setFormData(prev =>
    typeof updater === "function"
      ? updater(prev)
      : updater
  )
}
useEffect(() => {
  if (!onUpdate) return
  onUpdate(formData)
}, [formData])


const handleChange = (field: keyof LifestyleValues, value: any) => {
  pushUpdate(prev => ({
    ...prev,
    [field]: value === "" ? null : value,
  }))
}



  const reverse = (v: number) => 4 - v

  const get = (i: number): number =>
  Number(formData[`pss_q${i}` as keyof LifestyleValues] ?? 0)

useEffect(() => {
  const total =
    [1, 2, 3, 6, 9, 10].reduce((s, q) => s + get(q), 0) +
    [4, 5, 7, 8].reduce((s, q) => s + reverse(get(q)), 0)

  pushUpdate(prev => {
    if (prev.totalPSS10 === total) return prev
    return { ...prev, totalPSS10: total }
  })
}, [
  formData.pss_q1,
  formData.pss_q2,
  formData.pss_q3,
  formData.pss_q4,
  formData.pss_q5,
  formData.pss_q6,
  formData.pss_q7,
  formData.pss_q8,
  formData.pss_q9,
  formData.pss_q10,
])

// helpers for nested updates (diet, addictions, physicalActivity, regularity)
  const setDietFrequency = (key: string, freq: string, checked: boolean) => {
    const updated = { ...formData.dietFrequencies }
    if (!checked) delete updated[key]
    else updated[key] = freq
    pushUpdate({ ...formData, dietFrequencies: updated })
  }

  const setAddictionFrequency = (key: string, freq: string, checked: boolean) => {
    const updated = { ...formData.addictionFrequencies }
    if (!checked) delete updated[key]
    else updated[key] = freq
    pushUpdate({ ...formData, addictionFrequencies: updated })
  }

    const setPhysicalActivityRow = (
    row: "neat" | "aerobic" | "anaerobic",
    key: "frequency" | "intensity",
    value: string
  ) => {
    pushUpdate({
      ...formData,
      physicalActivity: {
        ...formData.physicalActivity,
        [row]: {
          ...formData.physicalActivity[row],
          [key]: value,
        },
      },
    })
  }
  
  // Frequency options (matching the paper's frequency scale)
  const frequencyOptions = [
    { value: "0", label: "Never" },
    { value: "1", label: "Once a month" },
    { value: "2", label: "Once in 2 weeks" },
    { value: "3", label: "Once a week" },
    { value: "4", label: "Often 2-3 times a week" },
    { value: "5", label: "Everyday" },
  ]

  // Intensity options (matching paper)
  const intensityOptions = [
    { value: "0", label: "V Light (anything other than rest)" },
    { value: "1", label: "Light (Breath not affected, can carry conversation)" },
    { value: "2", label: "Moderate (Breath affected slightly, can talk)" },
    { value: "3", label: "Vigorous (Heavy breathing, can speak a sentence)" },
    { value: "4", label: "Hard (Shortness of breath, difficulty talking)" },
    { value: "5", label: "Max (Out of breath, impossible to talk)" },
  ]

  // Diet items from the sheet
  const dietItems = [
    "Veg",
    "Non-Veg",
    "Egg",
    "Fermented",
    "Fried",
    "Bakery",
    "Sweet",
    "Packed",
    "Outside",
  ]

  const addictionItems = [
    "Aerated drinks",
    "Alcohol",
    "Smoking",
    "Tobacco",
    "Tea/Coffee",
    "Other",
  ]

  return (

      <div
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(180deg, #f3f8ff 0%, #e9f0ff 35%, #f7fbff 100%)",
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
                Lifestyle Assessment - Participant Form
              </h1>
              <p className="text-sm text-slate-600 mt-1">Self Defined & general lifestyle details of Participant</p>
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
      {/* <div className="max-w-5xl mx-auto space-y-6"> */}

    {/* <div className="space-y-6"> */}

      {/* ===== NEW: Top Lifestyle summary (fields from the paper) ===== */}
        <Card className="border-0 shadow-md bg-gradient-to-b from-white/90 to-blue-50/60">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M7 7h10" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>Stress Level Score Questionnaire</CardTitle>
            <CardDescription className="text-slate-600">Stress Levels</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="grid grid-cols-1 gap-6">

              {/* PSS-10 Questionnaire */}
            <div className="space-y-3">
              <Label className="text-slate-700 font-medium tracking-wide">
                PSS-10 Questionnaire (Scale 0 – 4)
              </Label>

              {[
                "In the last month, how often have you been upset because of something that happened unexpectedly?",
                "In the last month, how often have you felt that you were unable to control the important things in your life?",
                "In the last month, how often have you felt nervous and stressed?",
                "In the last month, how often have you felt confident about your ability to handle your personal problems?",
                "In the last month, how often have you felt that things were going your way?",
                "In the last month, how often have you found that you could not cope with all the things that you had to do?",
                "In the last month, how often have you been able to control irritations in your life?",
                "In the last month, how often have you felt that you were on top of things?",
                "In the last month, how often have you been angered because of things that happened that were outside of your control?",
                "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
              ].map((q, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 border rounded-xl px-3 py-3 bg-slate-50"
                >
                  <Label className="text-slate-700 font-normal leading-relaxed w-full text-sm">
                    {`PSS_Q${index + 1}. ${q}`}
                  </Label>

                  <Select
                    value={(formData as any)[`pss_q${index + 1}`] || ""}
                    onValueChange={(value) => handleChange(`pss_q${index + 1}` as keyof LifestyleValues, value)}

                      // handleChange(`pss_q${index + 1}`, value)}
                  >
                    <SelectTrigger className="border-slate-300 w-36 bg-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Never (0)</SelectItem>
                      <SelectItem value="1">Almost Never (1)</SelectItem>
                      <SelectItem value="2">Sometimes (2)</SelectItem>
                      <SelectItem value="3">Fairly Often (3)</SelectItem>
                      <SelectItem value="4">Very Often (4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}

              <div className="pt-2 text-slate-900 font-semibold text-right">
                Total PSS-10 Score: {formData.totalPSS10 ?? "-"}
              </div>

              {formData.totalPSS10 !== null && (
              <div>
                {formData.totalPSS10 <= 13 && "Stress Level: Low"}
                {formData.totalPSS10 > 13 && formData.totalPSS10 <= 26 && "Stress Level: Moderate"}
                {formData.totalPSS10 > 26 && "Stress Level: High"}
              </div>
            )}

            </div>

            {/* 2 Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-5">

              {/* Peak Active Hours */}
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <Label className="text-slate-800 font-medium text-[14.5px]">
                  Peak Active Hours
                </Label>

                <div className="flex flex-wrap gap-4 mt-1">
                  {["morning", "afternoon", "evening", "night"].map(item => {
                    const checked = formData.peakActiveHours?.includes(item)

                    return (
                      <div
                        key={item}
                        className="
                          flex items-center space-x-2
                          rounded-lg border border-slate-200
                          bg-white px-2.5 py-1.5
                          hover:border-slate-300
                        "
                      >
                        <Checkbox
                          id={`pa-${item}`}
                          checked={checked}
                          onCheckedChange={(isChecked) => {
                            const prev = formData.peakActiveHours || []

                            const updated = isChecked
                              ? [...prev, item]
                              : prev.filter(v => v !== item)

                            handleChange("peakActiveHours", updated)
                          }}
                          className="h-4 w-4 border-slate-400"
                        />

                        <Label
                          htmlFor={`pa-${item}`}
                          className="cursor-pointer text-slate-700 text-[14px] font-normal"
                        >
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Daily Average Screen Time */}
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <Label className="text-slate-800 font-medium text-[14.5px]">
                  Daily Average Screen Time (hrs)
                </Label>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: "Mobile", key: "screenMobile" },
                    { name: "Laptop/PC", key: "screenLaptop" },
                    { name: "Other", key: "screenOther" },
                  ].map((e) => (
                    <div
                      key={e.key}
                      className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5"
                    >
                      <Label className="w-20 text-slate-700 text-[13.5px]">
                        {e.name}
                      </Label>
                      <Input
                        placeholder="hrs"
                        value={(formData as any)[e.key] ?? ""}
                        onChange={(i) =>
                          handleChange(e.key, i.target.value === "" ? null : i.target.value)
                        }
                        className="h-8 border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sleep Quality */}
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <Label className="text-slate-800 font-medium text-[14.5px]">
                  Sleep Quality
                </Label>

                <Select
                  value={formData.sleepQualityDetailed || ""}
                  onValueChange={(v) => handleChange("sleepQualityDetailed", v)}
                >
                  <SelectTrigger className="h-8 border-slate-300 bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-300">
                    <SelectValue placeholder="Select sleep quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="interrupted">Interrupted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Daily Average Sleep */}
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <Label className="text-slate-800 font-medium text-[14.5px]">
                  Daily Average Sleep (hrs)
                </Label>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Night", key: "dailySleepNight" },
                    { name: "Day", key: "dailySleepDay" },
                  ].map((e) => (
                    <div
                      key={e.key}
                      className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5"
                    >
                      <Label className="w-20 text-slate-700 text-[13.5px]">
                        {e.name}
                      </Label>
                      <Input
                        placeholder="hrs"
                        value={(formData as any)[e.key] ?? ""}
                        onChange={(i) =>
                          handleChange(e.key, i.target.value === "" ? null : i.target.value)
                        }
                        className="h-8 border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
                      />
                    </div>
                  

                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== NEW: Frequency & Intensity Scale reference (static text) ===== */}
      <Card className="border-teal-300/70 bg-teal-50/70 rounded-lg border-[1.5px] border-dashed p-2 shadow-sm">
  <CardHeader className="bg-teal-100/60 border-b border-teal-200 rounded-t-lg px-3 py-2">
    <CardTitle className="text-sm font-semibold text-teal-900">Reference Scales</CardTitle>
    <CardDescription className="text-[11px] text-teal-700/90">
      Use this scale to fill the form below
    </CardDescription>
  </CardHeader>

  <CardContent className="px-3 pb-3 text-teal-900">
    <div className="space-y-3">

      {/* Frequency Scale */}
      <div>
        <Label className="font-medium text-xs text-teal-900">Frequency Scale</Label>
        <div className="mt-1.5 grid grid-cols-3 md:grid-cols-6 gap-1.5 text-[10.5px]">
          {[
            ["0", "Never"],
            ["1", "Once a month"],
            ["2", "Once in 2 weeks"],
            ["3", "Once a week"],
            ["4", "2–3 times/week"],
            ["5", "Everyday"],
          ].map(([num, label]) => (
            <div
              key={num}
              className="p-1.5 border border-teal-300 bg-white/90 rounded-md text-center shadow-sm"
            >
              <div className="text-xs font-semibold text-teal-900 leading-none">{num}</div>
              <span className="block text-[9px] mt-0.5 text-teal-700 leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Intensity Scale */}
      <div>
        <Label className="font-medium text-xs text-teal-900">Intensity Scale</Label>
        <div className="mt-1.5 grid grid-cols-3 md:grid-cols-6 gap-1.5 text-[10.5px]">
          {[
            ["0", "V Light (Anything other than rest)"],
            ["1", "Light (Breath not affected, can talk)"],
            ["2", "Moderate (Breath slightly affected)"],
            ["3", "Vigorous (Heavy breathing)"],
            ["4", "Hard (Shortness of breath)"],
            ["5", "Max (Out of breath, cannot talk)"],
          ].map(([num, title]) => (
            <div
              key={num}
              className="p-1.5 border border-teal-300 bg-white/90 rounded-md text-center shadow-sm"
            >
              <div className="text-xs font-semibold text-teal-900 leading-none">{num}</div>
              <div className="block text-[9px] mt-0.5 text-teal-700 leading-tight">
                {title}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </CardContent>
</Card>

      {/* ===== NEW: Diet table (multiple selection) ===== */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-lg text-slate-900">Diet (Use Frequency Scale)</CardTitle>
          <CardDescription className="text-slate-600">
            Mark items and select frequency (from Frequency Scale)
          </CardDescription>
        </CardHeader>

        <CardContent className="">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {dietItems.map((item) => {
                const checked =
                  !!(formData.dietFrequencies && formData.dietFrequencies[item])

                return (
                  <div key={item} className="flex flex-col border rounded p-3">
                    <div className="flex items-center justify-between">

                      {/* Checkbox */}
                      <div className="flex items-center space-x-2">
                        <input
                          id={`diet-${item}`}
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const defaultFreq = "5"
                            setDietFrequency(item, defaultFreq, e.target.checked)
                          }}
                        />
                        <Label
                          htmlFor={`diet-${item}`}
                          className="font-medium cursor-pointer text-slate-700"
                        >
                          {item}
                        </Label>
                      </div>

                      {/* Frequency Dropdown */}
                      <div className="w-40">
                        <Select
                          value={
                            (formData.dietFrequencies &&
                              formData.dietFrequencies[item]) ||
                            ""
                          }
                          onValueChange={(v) => {
                            if (v === "0") {
                              // force Never → numeric 0
                              setDietFrequency(item, "0", true)
                            } else {
                              setDietFrequency(item, v, !!v)
                            }
                          }}
                        >
                          <SelectTrigger className="border-slate-300 bg-white">
                            <SelectValue placeholder="Frequency">
                              {formData.dietFrequencies?.[item]
                                ? formData.dietFrequencies[item] // SHOW ONLY NUMBER
                                : "Frequency"}
                            </SelectValue>
                          </SelectTrigger>

                          <SelectContent>
                            {frequencyOptions.map((f) => (
                              <SelectItem key={f.value} value={f.value}>
                                {f.label} ({f.value})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
     

      {/* ===== NEW: Addictions (Use Frequency Scale) ===== */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-lg text-slate-900">
            Addictions (Use Frequency Scale)
          </CardTitle>
          <CardDescription className="text-slate-600">
            Mark items and select frequency (from Frequency Scale)
          </CardDescription>
        </CardHeader>

        <CardContent className="">
          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {addictionItems.map((item) => {
                const checked =
                  !!(formData.addictionFrequencies &&
                    formData.addictionFrequencies[item])

                return (
                  <div
                    key={item}
                    className="flex items-center justify-between border rounded p-3"
                  >

                    {/* Checkbox */}
                    <div className="flex items-center space-x-2">
                      <input
                        id={`add-${item}`}
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const defaultFreq = "3"
                          setAddictionFrequency(item, defaultFreq, e.target.checked)
                        }}
                      />
                      <Label
                        htmlFor={`add-${item}`}
                        className="font-medium cursor-pointer text-slate-700"
                      >
                        {item}
                      </Label>
                    </div>

                    {/* Frequency Dropdown */}
                    <div className="w-40">
                      <Select
                        value={
                          (formData.addictionFrequencies &&
                            formData.addictionFrequencies[item]) ||
                          ""
                        }
                        onValueChange={(v) => {
                          if (v === "0") {
                            setAddictionFrequency(item, "0", true)
                          } else {
                            setAddictionFrequency(item, v, !!v)
                          }
                        }}
                      >
                        <SelectTrigger className="border-slate-300 bg-white">
                          <SelectValue placeholder="Frequency">
                            {formData.addictionFrequencies?.[item]
                              ? formData.addictionFrequencies[item]
                              : "Frequency"}
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          {frequencyOptions.map((f) => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label} ({f.value})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>


      {/* ===== NEW: Physical Activity table (NEAT, Aerobic, Anaerobic) ===== */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-lg text-slate-900">Physical Activity (Use Scales)</CardTitle>
          <CardDescription className="text-slate-600">Enter frequency & intensity for each exercise type</CardDescription>
        </CardHeader>

        <CardContent className="">
          <div className="grid grid-cols-1 gap-4">

            {/* ================= NEAT ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center">
                <Label className="font-medium">Non-Exercise Activity Thermogenesis (NEAT)</Label>
              </div>

              {/* Frequency */}
              <div>
                <Label className="text-sm">Frequency</Label>
                <Select
                  value={formData?.physicalActivity?.neat?.frequency || ""}
                  onValueChange={(v) => setPhysicalActivityRow("neat", "frequency", v)}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select frequency">
                      {formData?.physicalActivity?.neat?.frequency
                        ? formData.physicalActivity.neat.frequency
                        : "Select frequency"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Intensity */}
              <div>
                <Label className="text-sm">Intensity</Label>
                <Select
                  value={formData?.physicalActivity?.neat?.intensity || ""}
                  onValueChange={(v) => setPhysicalActivityRow("neat", "intensity", v)}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select intensity">
                      {formData?.physicalActivity?.neat?.intensity
                        ? formData.physicalActivity.neat.intensity
                        : "Select intensity"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {intensityOptions.map((i) => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ================= AEROBIC ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center">
                <Label className="font-medium">Aerobic (Running, jogging, swimming, zumba)</Label>
              </div>

              {/* Frequency */}
              <div>
                <Label className="text-sm">Frequency</Label>
                <Select
                  value={formData?.physicalActivity?.aerobic?.frequency || ""}
                  onValueChange={(v) => setPhysicalActivityRow("aerobic", "frequency", v)}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select frequency">
                      {formData?.physicalActivity?.aerobic?.frequency
                        ? formData.physicalActivity.aerobic.frequency
                        : "Select frequency"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Intensity */}
              <div>
                <Label className="text-sm">Intensity</Label>
                <Select
                  value={formData?.physicalActivity?.aerobic?.intensity || ""}
                  onValueChange={(v) => setPhysicalActivityRow("aerobic", "intensity", v)}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select intensity">
                      {formData?.physicalActivity?.aerobic?.intensity
                        ? formData.physicalActivity.aerobic.intensity
                        : "Select intensity"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {intensityOptions.map((i) => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ================= ANAEROBIC ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center">
                <Label className="font-medium">Anaerobic (Weight lifting, strength exercise, gym)</Label>
              </div>

              {/* Frequency */}
              <div>
                <Label className="text-sm">Frequency</Label>
                <Select
                  value={formData?.physicalActivity?.anaerobic?.frequency || ""}
                  onValueChange={(v) => setPhysicalActivityRow("anaerobic", "frequency", v)}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select frequency">
                      {formData?.physicalActivity?.anaerobic?.frequency
                        ? formData.physicalActivity.anaerobic.frequency
                        : "Select frequency"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Intensity */}
              <div>
                <Label className="text-sm">Intensity</Label>
                <Select
                  value={formData?.physicalActivity?.anaerobic?.intensity || ""}
                  onValueChange={(v) => setPhysicalActivityRow("anaerobic", "intensity", v)}
                >
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Select intensity">
                      {formData?.physicalActivity?.anaerobic?.intensity
                        ? formData.physicalActivity.anaerobic.intensity
                        : "Select intensity"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {intensityOptions.map((i) => (
                      <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>



      {/* ===== NEW: Regularity in Lifestyle (0-5) ===== */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <CardTitle className="text-lg text-slate-900">Regularity in Lifestyle (0-5)</CardTitle>
          <CardDescription className="text-slate-600">
            Rate regularity from 0 (Never) to 5 (Everyday)
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-4 gap-4 md:grid-cols-4">
            {[
              { key: "wakingTimings", label: "Waking up timings" },
              { key: "sleepTimings", label: "Sleep timings" },
              { key: "mealTimings", label: "Meal timings" },
              { key: "exercise", label: "Exercise" },
            ].map((field) => (
              <div key={field.key}>
                <Label className="text-slate-700 font-medium">{field.label}</Label>
                <div className="pt-2">
                  <Select
                    value={(formData.regularity as any)?.[field.key] || ""}
                    // onValueChange={(v) =>
                    //   setRegularityField(field.key as keyof NonNullable<LifestyleData["regularity"]>, v)
                    // }
                    onValueChange={(v) => {
                      pushUpdate({
                        ...formData,
                        regularity: {
                          ...formData.regularity,
                          [field.key]: v,
                        },
                      })
                    }}
                  >

                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Select frequency">
                        {(formData.regularity as any)?.[field.key] || "Select frequency"}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {[
                        { value: "0", label: "Never" },
                        { value: "1", label: "Once a month" },
                        { value: "2", label: "Once in 2 weeks" },
                        { value: "3", label: "Once a week" },
                        { value: "4", label: "Often 2-3 times a week" },
                        { value: "5", label: "Everyday" },
                      ].map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      </div>
    </div>
  )
}
