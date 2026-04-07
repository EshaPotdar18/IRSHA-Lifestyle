"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

/* ============================================================
   TYPES
============================================================ */

type OptionKey = "vata" | "pitta" | "kapha"

interface SelectionMap {
  [id: number]: {
    vata: boolean
    pitta: boolean
    kapha: boolean
  }
}

/* ============================================================
   QUESTIONS
============================================================ */

const QUESTIONS = [
  { id: 1, label: "Body frame", options: { vata: "Lean long", pitta: "Medium", kapha: "Large, plump" } },
  { id: 2, label: "Body mass index", options: { vata: "< 19", pitta: "19–25", kapha: "> 25" } },
  { id: 3, label: "Speech – speed", options: { vata: "Fast", pitta: "Fast", kapha: "Slow" } },
  { id: 4, label: "Speech – clarity", options: { vata: "Diffuse", pitta: "Clear", kapha: "Clear, reserved" } },
  { id: 5, label: "Speech – character", options: { vata: "Talkative", pitta: "Impressive", kapha: "Reserved" } },
  { id: 6, label: "Eyes – sclera colour", options: { vata: "Blackish", pitta: "Reddish", kapha: "Milky white" } },
  { id: 7, label: "Lips – character", options: { vata: "Cracked", pitta: "Soft, thin", kapha: "Smooth, glossy" } },
  { id: 8, label: "Lips – colour", options: { vata: "Dark", pitta: "Reddish", kapha: "Pinkish" } },
  { id: 9, label: "Nails – character", options: { vata: "Rough", pitta: "Smooth", kapha: "Large, glossy" } },
  { id: 10, label: "Nails – colour", options: { vata: "Dark", pitta: "Reddish", kapha: "Pinkish" } },
  { id: 11, label: "Hair – texture", options: { vata: "Dry", pitta: "Soft", kapha: "Shiny" } },
  { id: 12, label: "Hair – colour", options: { vata: "Black", pitta: "Brown / grey", kapha: "Black" } },
  { id: 13, label: "Hair – thickness", options: { vata: "Less", pitta: "Medium", kapha: "More" } },
  { id: 14, label: "Skin – character", options: { vata: "Rough", pitta: "Oily, moles", kapha: "Smooth" } },
  {
    id: 15,
    label: "Skin – colour",
    options: { vata: "Dark tinge", pitta: "Yellowish tinge", kapha: "Fair / pinkish" },
  },
  { id: 16, label: "Skin – temperature", options: { vata: "Cold", pitta: "Warm", kapha: "Cold" } },
  { id: 17, label: "Body odour", options: { vata: "Absent", pitta: "Present", kapha: "Absent" } },
  { id: 18, label: "Appetite – frequency", options: { vata: "Variable", pitta: "Frequent", kapha: "Low" } },
  { id: 19, label: "Appetite – quantity", options: { vata: "Low", pitta: "High", kapha: "High" } },
  { id: 20, label: "Hunger tolerance", options: { vata: "Poor", pitta: "Very poor", kapha: "Good" } },
  {
    id: 21,
    label: "Effect of skipped meals",
    options: { vata: "Constipation", pitta: "Headache / nausea", kapha: "No effect" },
  },
  { id: 22, label: "Thirst", options: { vata: "Irregular", pitta: "Excessive", kapha: "Low" } },
  { id: 23, label: "Bowel habit", options: { vata: "Irregular", pitta: "Regular", kapha: "Regular" } },
  { id: 24, label: "Stool consistency", options: { vata: "Hard", pitta: "Semi-solid", kapha: "Well-formed" } },
  { id: 25, label: "Stool colour", options: { vata: "Dark", pitta: "Yellowish", kapha: "Yellowish" } },
  { id: 26, label: "Sleep quality", options: { vata: "Interrupted", pitta: "Sound", kapha: "Deep" } },
  { id: 27, label: "Sleep duration", options: { vata: "< 6 hours", pitta: "6–8 hours", kapha: "> 8 hours" } },
  { id: 28, label: "Response to excitement", options: { vata: "Quick", pitta: "Intense", kapha: "Rare" } },
  { id: 29, label: "Working style", options: { vata: "Fast", pitta: "Moderate", kapha: "Slow" } },
  { id: 30, label: "Movement style", options: { vata: "Erratic", pitta: "Precise", kapha: "Steady" } },
  { id: 31, label: "Physical strength", options: { vata: "Low", pitta: "Moderate", kapha: "High" } },
  { id: 32, label: "Stress handling", options: { vata: "Anxious", pitta: "Irritable", kapha: "Calm" } },
  { id: 33, label: "Control over desires", options: { vata: "Poor", pitta: "Moderate", kapha: "Good" } },
  { id: 34, label: "Concentration", options: { vata: "Poor", pitta: "Good when interested", kapha: "Excellent" } },
  { id: 35, label: "Grasping power", options: { vata: "Quick but poor", pitta: "Quick and good", kapha: "Slow" } },
  { id: 36, label: "Retention capacity", options: { vata: "Poor", pitta: "Average", kapha: "Good" } },
  { id: 37, label: "Memory", options: { vata: "Weak", pitta: "Average", kapha: "Strong" } },
]

/* ============================================================
   BIOCHEMISTRY CONFIG
============================================================ */

const BIO = [
  { key: "creatinine", label: "Serum Creatinine", unit: "mg/dl", min: 0.55, max: 1.02, range: "0.55 – 1.02" },
  { key: "totalCholesterol", label: "Total Cholesterol", unit: "mg/dl", max: 200, range: "< 200" },
  { key: "triglycerides", label: "Triglycerides", unit: "mg/dl", max: 150, range: "< 150" },
  { key: "hdl", label: "HDL Cholesterol", unit: "mg/dl", min: 40, range: "> 40" },
  { key: "vldl", label: "VLDL Cholesterol", unit: "mg/dl", min: 5, max: 51, range: "5 – 51" },
  { key: "ldl", label: "LDL Cholesterol", unit: "mg/dl", max: 130, range: "< 130" },
  { key: "tc_hdl_ratio", label: "Total Cholesterol / HDL Ratio", unit: "", max: 5, range: "Male < 5.0 | Female < 4.5" },
  { key: "ldl_hdl_ratio", label: "LDL / HDL Ratio", unit: "", max: 3.2, range: "Male < 3.6 | Female < 3.2" },
  { key: "hba1c", label: "HbA1c", unit: "%", max: 5.4, range: "≤5.4 Normal | 5.7–6.4 Prediabetes | ≥6.5 Diabetes" },
  {
    key: "fasting_glucose",
    label: "Fasting Blood Glucose (FBS)",
    unit: "mg/dl",
    min: 70,
    max: 99,
    range: "70–99 Normal | 100–125 Prediabetes | ≥126 Diabetes",
  },
  {
    key: "fasting_insulin",
    label: "Fasting Insulin",
    unit: "µIU/mL",
    min: 2,
    max: 25,
    range: "Optimal <10 | Lab range 2–25",
  },
  { key: "homa_ir", label: "HOMA-IR", unit: "", max: 1.8, range: "<1 Optimal | 1–2.5 Normal | >2 Insulin Resistance" },
]

/* ============================================================
   HELPERS
============================================================ */
// ✅ typing-safe numeric input
const sanitizeNumeric = (v: string) => {
  if (v === "") return ""

  let clean = v.replace(/[^0-9.]/g, "")
  const parts = clean.split(".")
  if (parts.length > 2) clean = parts[0] + "." + parts[1]

  const [int, dec] = clean.split(".")
  if (int.length > 4) return int.slice(0, 4)
  if (dec && dec.length > 3) return `${int}.${dec.slice(0, 3)}`

  return clean
}

// ✅ final formatting ONLY on blur
const format3 = (v: string) => {
  const n = Number(v)
  return isNaN(n) ? "" : n.toFixed(3)
}

const getFlag = (value?: string, min?: number, max?: number) => {
  const n = Number(value)
  if (isNaN(n)) return ""
  if (min !== undefined && n < min) return "Low"
  if (max !== undefined && n > max) return "High"
  return "Normal"
}

const calcRatio = (a?: string, b?: string) => {
  const x = Number(a)
  const y = Number(b)
  if (!x || !y) return ""
  return (x / y).toFixed(3)
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function BiochemicalWithPrakriti({ data = {}, onUpdate }: any) {
  const [formData, setFormData] = useState<any>(data?.values || {})

  /* ---------------- BIO INPUT ---------------- */

  const handleChange = (k: string, v: string) => {
    const clean = sanitizeNumeric(v)
    const updated = { ...formData, [k]: clean }

    updated.tc_hdl_ratio = calcRatio(updated.totalCholesterol, updated.hdl)
    updated.ldl_hdl_ratio = calcRatio(updated.ldl, updated.hdl)

    const flags: any = {}
    BIO.forEach((b) => {
      flags[b.key] = getFlag(updated[b.key], b.min, b.max)
    })

    setFormData(updated)

    onUpdate?.({
      values: updated,
      flags,
      prakriti: data?.prakriti || {},
    })
  }

  const handleBlur = (k: string) => {
    if (!formData[k]) return
    const updated = { ...formData, [k]: format3(formData[k]) }
    setFormData(updated)

    const flags: any = {}
    BIO.forEach((b) => {
      flags[b.key] = getFlag(updated[b.key], b.min, b.max)
    })

    onUpdate?.({
      values: updated,
      flags,
      prakriti: data?.prakriti || {},
    })
  }

  /* ---------------- PRAKRITI LOGIC (UNCHANGED) ---------------- */

  const [sel, setSel] = useState<SelectionMap>(() => {
    const base: any = {}
    QUESTIONS.forEach((q) => {
      base[q.id] = data?.prakriti?.selections?.[q.id] ?? { vata: false, pitta: false, kapha: false }
    })
    return base
  })

  const toggle = (id: number, d: OptionKey) => {
    setSel((p) => ({ ...p, [id]: { ...p[id], [d]: !p[id][d] } }))
  }

  const totals = { v: 0, p: 0, k: 0 }
  Object.values(sel).forEach((s) => {
    if (s.vata) totals.v++
    if (s.pitta) totals.p++
    if (s.kapha) totals.k++
  })

  const t = totals.v + totals.p + totals.k
  const pct = (x: number) => (t ? Math.round((x / t) * 100) : 0)

  let conclusion = "—"
  if (t) {
    const arr = [
      { k: "Vata", v: pct(totals.v) },
      { k: "Pitta", v: pct(totals.p) },
      { k: "Kapha", v: pct(totals.k) },
    ].filter((x) => x.v >= 40)

    conclusion = arr.length ? arr.map((x) => x.k).join("-") + " Prakriti" : "Tridoshic Prakriti"
  }

  useEffect(() => {
    const prakritiData = {
      totals,
      percentages: {
        vata: pct(totals.v),
        pitta: pct(totals.p),
        kapha: pct(totals.k),
      },
      conclusion,
      selections: sel,
    }

    onUpdate?.({
      values: formData,
      flags: (() => {
        const flags: any = {}
        BIO.forEach((b) => {
          flags[b.key] = getFlag(formData[b.key], b.min, b.max)
        })
        return flags
      })(),
      prakriti: prakritiData,
    })
  }, [sel])

  /* ---------------- RENDER ---------------- */

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 space-y-10"
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
                  <path
                    d="M12 2C9.243 2 7 4.243 7 7c0 2.757 2.243 5 5 5s5-2.243 5-5c0-2.757-2.243-5-5-5z"
                    stroke="url(#g1)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 22c0-4 4-7 8-7s8 3 8 7"
                    stroke="url(#g1)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Biochemical and Ayurvedic-Prakriti Assessment
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Biochemical Parameters and Basic Constitution of the Participant
              </p>
            </div>

            <div className="hidden sm:flex items-center"></div>
          </div>

          {/* subtle animated underline */}
          <div className="mt-4 h-1 rounded-full overflow-hidden">
            <div
              className="h-1 w-48 rounded-full animate-slide"
              style={{
                background: "linear-gradient(90deg,#60a5fa,#3b82f6,#60a5fa)",
                boxShadow: "0 6px 20px rgba(59,130,246,0.1)",
              }}
            />
          </div>
        </div>
        {/* <div className="max-w-5xl mx-auto space-y-6"> */}

        <div className="max-w-6xl mx-auto space-y-10">
          {/* BIOCHEMISTRY */}
          <Card
            className="border-0 shadow-md"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,250,255,0.9))" }}
          >
            <CardHeader className="px-6">
              <CardTitle className="text-lg text-slate-900">Biochemical Assessment</CardTitle>
              <CardDescription className="text-slate-600">
                As per NABL accredited laboratory reference ranges
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <div className="grid grid-cols-12 text-xs font-semibold border-b pb-2 text-slate-600">
                <div className="col-span-4">Test</div>
                <div className="col-span-3">Result</div>
                <div className="col-span-2">Unit</div>
                <div className="col-span-2">Reference</div>
                <div className="col-span-1 text-center">Flag</div>
              </div>

              {BIO.map((b) => {
                const flag = getFlag(formData[b.key], b.min, b.max)

                return (
                  <div key={b.key} className="grid grid-cols-12 items-center py-3 border-b text-sm">
                    <div className="col-span-4 font-medium text-slate-800">{b.label}</div>
                    <div className="col-span-3">
                      <Input
                        inputMode="decimal"
                        value={formData[b.key] ?? ""}
                        // onChange={e => handleBioChange(b.key, e.target.value)}
                        onChange={(e) => handleChange(b.key, e.target.value)}
                        onBlur={() => handleBlur(b.key)}
                        className="h-8 w-24 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 text-sm"
                      />
                    </div>
                    <div className="col-span-2 text-slate-600">{b.unit}</div>
                    <div className="col-span-2 text-xs text-slate-500">{b.range}</div>
                    <div
                      className={`col-span-1 text-center font-semibold ${
                        flag === "High" ? "text-red-600" : flag === "Low" ? "text-amber-600" : "text-green-600"
                      }`}
                    >
                      {flag}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* PRAKRITI */}
          <Accordion type="single" collapsible>
            <AccordionItem value="prakriti">
              <AccordionTrigger
                className="
                text-lg font-semibold
                text-blue-900
                bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50
                px-6 py-4
                rounded-xl
                border border-blue-300
                shadow-sm ring-1 ring-blue-100
                hover:shadow-md
                hover:bg-blue-100
                transition-all
                relative
                before:absolute before:left-0 before:top-0 before:h-full before:w-1
                before:bg-blue-500 before:rounded-l-xl
              "
              >
                TNMC Prakriti Questionnaire
              </AccordionTrigger>

              <AccordionContent>
                <Card
                  className="mt-4 border-0 shadow-md"
                  style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245,250,255,0.9))",
                  }}
                >
                  <CardContent className="pt-6 space-y-6">
                    {/* QUESTIONS */}
                    {QUESTIONS.map((q) => (
                      <div key={q.id} className="border-b pb-5">
                        <div className="font-medium text-sm mb-3 text-slate-800">
                          {q.id}. {q.label}
                        </div>

                        <div className="grid md:grid-cols-3 gap-3">
                          {(["vata", "pitta", "kapha"] as OptionKey[]).map((d) => (
                            <label
                              key={d}
                              className={`flex gap-2 p-3 rounded-lg border cursor-pointer text-xs transition
                          ${sel[q.id][d] ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}
                            >
                              <input type="checkbox" checked={sel[q.id][d]} onChange={() => toggle(q.id, d)} />
                              <span>
                                <span className="font-semibold capitalize">{d}</span>
                                <br />
                                <span className="text-slate-600">{q.options[d]}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* PRAKRITI RESULT */}
                    <div
                      className="mt-8 p-6 rounded-xl border border-blue-200
                          bg-gradient-to-br from-blue-50 via-white to-indigo-50
                          shadow-sm ring-1 ring-blue-100"
                    >
                      {/* Heading */}
                      <div className="mb-6 text-center">
                        <div className="text-xs uppercase tracking-widest text-blue-600">Prakriti Analysis</div>
                        <div className="text-lg font-semibold text-slate-900">Constitutional Dominance Summary</div>
                      </div>

                      {/* DOSHA GRID */}
                      <div className="grid grid-cols-3 gap-4 text-center mb-6">
                        <div className="rounded-lg bg-amber-50 border border-amber-200 py-4">
                          <div className="text-xs uppercase text-amber-700">Vata</div>
                          <div className="text-xl font-bold text-amber-900">
                            {totals.v} ({pct(totals.v)}%)
                          </div>
                        </div>

                        <div className="rounded-lg bg-red-50 border border-red-200 py-4">
                          <div className="text-xs uppercase text-red-700">Pitta</div>
                          <div className="text-xl font-bold text-red-900">
                            {totals.p} ({pct(totals.p)}%)
                          </div>
                        </div>

                        <div className="rounded-lg bg-emerald-50 border border-emerald-200 py-4">
                          <div className="text-xs uppercase text-emerald-700">Kapha</div>
                          <div className="text-xl font-bold text-emerald-900">
                            {totals.k} ({pct(totals.k)}%)
                          </div>
                        </div>
                      </div>

                      {/* FINAL INTERPRETATION */}
                      <div className="pt-5 border-t text-center">
                        <div className="text-xl font-semibold text-blue-900">{conclusion}</div>

                        <div className="mt-2 text-sm text-slate-600">
                          Based on cumulative physical, metabolic, and psychological traits
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
