"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

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
  { id: 15, label: "Skin – colour", options: { vata: "Dark tinge", pitta: "Yellowish tinge", kapha: "Fair / pinkish" } },
  { id: 16, label: "Skin – temperature", options: { vata: "Cold", pitta: "Warm", kapha: "Cold" } },
  { id: 17, label: "Body odour", options: { vata: "Absent", pitta: "Present", kapha: "Absent" } },
  { id: 18, label: "Appetite – frequency", options: { vata: "Variable", pitta: "Frequent", kapha: "Low" } },
  { id: 19, label: "Appetite – quantity", options: { vata: "Low", pitta: "High", kapha: "High" } },
  { id: 20, label: "Hunger tolerance", options: { vata: "Poor", pitta: "Very poor", kapha: "Good" } },
  { id: 21, label: "Effect of skipped meals", options: { vata: "Constipation", pitta: "Headache / nausea", kapha: "No effect" } },
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
   BIOCHEMISTRY CONFIG (MATCHES REPORT)
============================================================ */

const BIO = [
  {
    key: "creatinine",
    label: "Serum Creatinine",
    unit: "mg/dl",
    min: 0.55,
    max: 1.02,
    range: "0.55 – 1.02",
  },
  {
    key: "totalCholesterol",
    label: "Total Cholesterol",
    unit: "mg/dl",
    max: 200,
    range: "< 200",
  },
  {
    key: "triglycerides",
    label: "Triglycerides",
    unit: "mg/dl",
    max: 150,
    range: "< 150",
  },
  {
    key: "hdl",
    label: "HDL Cholesterol",
    unit: "mg/dl",
    min: 40,
    range: "> 40",
  },
  {
    key: "vldl",
    label: "VLDL Cholesterol",
    unit: "mg/dl",
    min: 5,
    max: 51,
    range: "5 – 51",
  },
  {
    key: "ldl",
    label: "LDL Cholesterol",
    unit: "mg/dl",
    max: 130,
    range: "< 130",
  },
  {
    key: "tc_hdl_ratio",
    label: "Total Cholesterol / HDL Ratio",
    unit: "",
    max: 5,
    range: "Male < 5.0 | Female < 4.5",
  },
  {
    key: "ldl_hdl_ratio",
    label: "LDL / HDL Ratio",
    unit: "",
    max: 3.2,
    range: "Male < 3.6 | Female < 3.2",
  },
  {
    key: "hba1c",
    label: "HbA1c",
    unit: "%",
    max: 5.4,
    range: "≤5.4 Normal | 5.7–6.4 Prediabetes | ≥6.5 Diabetes",
  },
]

/* ============================================================
   HELPERS
============================================================ */

const getFlag = (value?: string, min?: number, max?: number) => {
  const n = Number(value)
  if (isNaN(n)) return ""
  if (min !== undefined && n < min) return "Low"
  if (max !== undefined && n > max) return "High"
  return "Normal"
}

const numericOnly = (v: string) => v.replace(/[^0-9.]/g, "")

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function BiochemicalWithPrakriti({
  data = {},
  onUpdateBiochemical,
  initialSelections,
  onUpdatePrakriti,
}: any) {
  const [formData, setFormData] = useState<any>(data)

  const handleBioChange = (k: string, v: string) => {
    const value = numericOnly(v)
    const updated = { ...formData, [k]: value }

    const flags: any = {}
    BIO.forEach(b => {
      flags[b.key] = getFlag(updated[b.key], b.min, b.max)
    })

    setFormData(updated)
    onUpdateBiochemical?.({ ...updated, flags })
  }

  /* ---------------- PRAKRITI LOGIC (UNCHANGED) ---------------- */

  const [sel, setSel] = useState<SelectionMap>(() => {
    const base: any = {}
    QUESTIONS.forEach(q => {
      base[q.id] =
        initialSelections?.[q.id] ?? {
          vata: false,
          pitta: false,
          kapha: false,
        }
    })
    return base
  })

  const toggle = (id: number, d: OptionKey) => {
    setSel(p => ({ ...p, [id]: { ...p[id], [d]: !p[id][d] } }))
  }

  const totals = { v: 0, p: 0, k: 0 }
  Object.values(sel).forEach(s => {
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
    ].filter(x => x.v >= 40)

    conclusion = arr.length
      ? arr.map(x => x.k).join("-") + " Prakriti"
      : "Tridoshic Prakriti"
  }

  useEffect(() => {
    onUpdatePrakriti?.({
      totals,
      percentages: {
        vata: pct(totals.v),
        pitta: pct(totals.p),
        kapha: pct(totals.k),
      },
      conclusion,
    })
  }, [sel])

  /* ---------------- RENDER ---------------- */

  return (
    <div className="space-y-10">

      {/* BIOCHEMISTRY */}
      <Card>
        <CardHeader>
          <CardTitle>Biochemical Assessment</CardTitle>
          <CardDescription>
            As per NABL accredited laboratory reference ranges
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-12 text-xs font-semibold border-b pb-2 text-slate-600">
            <div className="col-span-4">Test</div>
            <div className="col-span-3">Result</div>
            <div className="col-span-2">Unit</div>
            <div className="col-span-2">Reference</div>
            <div className="col-span-1 text-center">Flag</div>
          </div>

          {BIO.map(b => {
            const flag = getFlag(formData[b.key], b.min, b.max)

            return (
              <div
                key={b.key}
                className="grid grid-cols-12 items-center py-2 border-b text-sm"
              >
                <div className="col-span-4 font-medium">{b.label}</div>
                <div className="col-span-3">
                  <Input
                    inputMode="decimal"
                    value={formData[b.key] ?? ""}
                    onChange={e =>
                      handleBioChange(b.key, e.target.value)
                    }
                    className="h-8"
                  />
                </div>
                <div className="col-span-2 text-slate-600">{b.unit}</div>

                <div className="col-span-2 text-xs text-slate-500">
                  {b.range}
                </div>

                <div
                  className={`col-span-1 text-center font-semibold ${
                    flag === "High"
                      ? "text-red-600"
                      : flag === "Low"
                      ? "text-amber-600"
                      : "text-green-600"
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
                <AccordionTrigger className="text-lg font-semibold">
                  TNMC Prakriti Questionnaire
                </AccordionTrigger>
      
                <AccordionContent>
                  <Card className="mt-4">
                    <CardContent className="pt-6 space-y-4">
      
                      {QUESTIONS.map(q => (
                        <div key={q.id} className="border-b pb-4">
                          <div className="font-medium text-sm mb-2">
                            {q.id}. {q.label}
                          </div>
                          <div className="grid md:grid-cols-3 gap-2">
                            {(["vata","pitta","kapha"] as OptionKey[]).map(d => (
                              <label key={d} className="flex gap-2 text-xs border rounded p-2">
                                <input type="checkbox" checked={sel[q.id][d]} onChange={() => toggle(q.id, d)} />
                                <span>
                                  <span className="font-semibold capitalize">{d}</span><br />
                                  <span className="text-slate-600">{q.options[d]}</span>
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
      
                      <div className="mt-6 p-4 border rounded bg-slate-50">
                        <div className="grid grid-cols-3 text-center">
                          <div>Vata<br /><b>{totals.v} ({pct(totals.v)}%)</b></div>
                          <div>Pitta<br /><b>{totals.p} ({pct(totals.p)}%)</b></div>
                          <div>Kapha<br /><b>{totals.k} ({pct(totals.k)}%)</b></div>
                        </div>
                        <div className="mt-3 pt-3 border-t text-center font-semibold">
                          {conclusion}
                        </div>
                      </div>
      
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )
      }


// "use client"

// import { useEffect, useState } from "react"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion"

// /* ============================================================
//    TYPES
// ============================================================ */

// type OptionKey = "vata" | "pitta" | "kapha"

// interface SelectionMap {
//   [id: number]: {
//     vata: boolean
//     pitta: boolean
//     kapha: boolean
//   }
// }

// /* ============================================================
//    PRAKRITI QUESTIONS (FULL 37)
// ============================================================ */

// /* ============================================================
//    BIOCHEMISTRY CONFIG (UI NAMES FIXED)
// ============================================================ */

// const BIO = [
//   { key: "creatinine", label: "Serum Creatinine", unit: "mg/dl", min: 0.55, max: 1.02, range: "0.55 – 1.02" },
//   { key: "totalCholesterol", label: "Total Cholesterol", unit: "mg/dl", max: 200, range: "< 200 (Desirable)" },
//   { key: "triglycerides", label: "Triglycerides", unit: "mg/dl", max: 150, range: "< 150" },
//   { key: "hdl", label: "HDL Cholesterol", unit: "mg/dl", min: 40, range: "> 40" },
//   { key: "ldl", label: "LDL Cholesterol", unit: "mg/dl", max: 130, range: "< 130" },
//   { key: "vldl", label: "VLDL Cholesterol", unit: "mg/dl", min: 5, max: 51, range: "5 – 51" },
//   { key: "hba1c", label: "HbA1c", unit: "%", range: "≤5.4 Normal | 5.7–6.4 Prediabetes | ≥6.5 Diabetes" },
// ]

// const getFlag = (value?: string, min?: number, max?: number) => {
//   const n = Number(value)
//   if (isNaN(n)) return ""
//   if (min !== undefined && n < min) return "Low"
//   if (max !== undefined && n > max) return "High"
//   return "Normal"
// }

// /* ============================================================
//    MAIN COMPONENT
// ============================================================ */

// export default function BiochemicalWithPrakriti({
//   data = {},
//   onUpdateBiochemical,
//   initialSelections,
//   onUpdatePrakriti,
// }: any) {
//   const [formData, setFormData] = useState<any>(data)

//   const handleBioChange = (k: string, v: string) => {
//     const updated = { ...formData, [k]: v }
//     const flags: any = {}
//     BIO.forEach(b => {
//       flags[b.key] = getFlag(updated[b.key], b.min, b.max)
//     })
//     setFormData(updated)
//     onUpdateBiochemical?.({ ...updated, flags })
//   }

//   /* ---------------- PRAKRITI LOGIC (UNCHANGED) ---------------- */

//   const [sel, setSel] = useState<SelectionMap>(() => {
//     const base: any = {}
//     QUESTIONS.forEach(q => {
//       base[q.id] = initialSelections?.[q.id] ?? { vata: false, pitta: false, kapha: false }
//     })
//     return base
//   })

//   const toggle = (id: number, d: OptionKey) => {
//     setSel(p => ({ ...p, [id]: { ...p[id], [d]: !p[id][d] } }))
//   }

//   const totals = { v: 0, p: 0, k: 0 }
//   Object.values(sel).forEach(s => {
//     if (s.vata) totals.v++
//     if (s.pitta) totals.p++
//     if (s.kapha) totals.k++
//   })
//   const t = totals.v + totals.p + totals.k
//   const pct = (x: number) => (t ? Math.round((x / t) * 100) : 0)

//   let conclusion = "—"
//   if (t) {
//     const arr = [
//       { k: "Vata", v: pct(totals.v) },
//       { k: "Pitta", v: pct(totals.p) },
//       { k: "Kapha", v: pct(totals.k) },
//     ].filter(x => x.v >= 40)
//     conclusion = arr.length ? arr.map(x => x.k).join("-") + " Prakriti" : "Tridoshic Prakriti"
//   }

//   useEffect(() => {
//     onUpdatePrakriti?.({
//       totals,
//       percentages: { vata: pct(totals.v), pitta: pct(totals.p), kapha: pct(totals.k) },
//       conclusion,
//     })
//   }, [sel])

//   /* ---------------- RENDER ---------------- */

//   return (
//     <div className="space-y-10">

//       {/* BIOCHEMISTRY */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Biochemical Assessment</CardTitle>
//           <CardDescription>As per NABL accredited laboratory reference ranges</CardDescription>
//         </CardHeader>

//         <CardContent>
//           <div className="grid grid-cols-12 font-semibold text-sm border-b pb-2">
//             <div className="col-span-4">Test</div>
//             <div className="col-span-3">Result</div>
//             <div className="col-span-2">Unit</div>
//             <div className="col-span-2">Reference Range</div>
//             <div className="col-span-1">Flag</div>
//           </div>

//           {BIO.map(b => {
//             const flag = getFlag(formData[b.key], b.min, b.max)
//             return (
//               <div key={b.key} className="grid grid-cols-12 items-center border-b py-2 text-sm">
//                 <div className="col-span-4 font-medium">{b.label}</div>
//                 <div className="col-span-3">
//                   <Input value={formData[b.key] ?? ""} onChange={e => handleBioChange(b.key, e.target.value)} />
//                 </div>
//                 <div className="col-span-2 text-slate-600">{b.unit}</div>
//                 <div className="col-span-2 text-xs text-slate-500">{b.range}</div>
//                 <div className={`col-span-1 font-semibold ${
//                   flag === "High" ? "text-red-600" :
//                   flag === "Low" ? "text-amber-600" :
//                   "text-green-600"
//                 }`}>
//                   {flag}
//                 </div>
//               </div>
//             )
//           })}
//         </CardContent>
//       </Card>

//       {/* PRAKRITI */}
//       <Accordion type="single" collapsible>
//         <AccordionItem value="prakriti">
//           <AccordionTrigger className="text-lg font-semibold">
//             TNMC Prakriti Questionnaire
//           </AccordionTrigger>

//           <AccordionContent>
//             <Card className="mt-4">
//               <CardContent className="pt-6 space-y-4">

//                 {QUESTIONS.map(q => (
//                   <div key={q.id} className="border-b pb-4">
//                     <div className="font-medium text-sm mb-2">
//                       {q.id}. {q.label}
//                     </div>
//                     <div className="grid md:grid-cols-3 gap-2">
//                       {(["vata","pitta","kapha"] as OptionKey[]).map(d => (
//                         <label key={d} className="flex gap-2 text-xs border rounded p-2">
//                           <input type="checkbox" checked={sel[q.id][d]} onChange={() => toggle(q.id, d)} />
//                           <span>
//                             <span className="font-semibold capitalize">{d}</span><br />
//                             <span className="text-slate-600">{q.options[d]}</span>
//                           </span>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 ))}

//                 <div className="mt-6 p-4 border rounded bg-slate-50">
//                   <div className="grid grid-cols-3 text-center">
//                     <div>Vata<br /><b>{totals.v} ({pct(totals.v)}%)</b></div>
//                     <div>Pitta<br /><b>{totals.p} ({pct(totals.p)}%)</b></div>
//                     <div>Kapha<br /><b>{totals.k} ({pct(totals.k)}%)</b></div>
//                   </div>
//                   <div className="mt-3 pt-3 border-t text-center font-semibold">
//                     {conclusion}
//                   </div>
//                 </div>

//               </CardContent>
//             </Card>
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   )
// }
// NEWWWWWWWWWWWWWWWWWWWWWWW  ................................................................
// "use client"

// import { useState, useEffect } from "react"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion"

// // --------------------------------------------------------------------
// // 1. PRAKRITI QUESTIONNAIRE (your same logic, unchanged)
// // --------------------------------------------------------------------

// type OptionKey = "vata" | "pitta" | "kapha"

// interface SelectionMap {
//   [questionId: number]: {
//     vata: boolean
//     pitta: boolean
//     kapha: boolean
//   }
// }

// const QUESTIONS = [
//   { id: 1, label: "Body frame", options: { vata: "Lean long", pitta: "Medium", kapha: "Large, plump, fleshy, fatty" } },
//   { id: 2, label: "Body Mass Index", options: { vata: "< 19", pitta: "19–25", kapha: "> 25" } },
//   { id: 3, label: "Speech — Speed", options: { vata: "Fast", pitta: "Fast", kapha: "Slow" } },
//   { id: 4, label: "Speech — Clarity", options: { vata: "Diffuse words", pitta: "Clear", kapha: "Clear, less talkative, reserved" } },
//   { id: 5, label: "Speech — Character", options: { vata: "Deviates from topic, more talkative", pitta: "Impressive speaker", kapha: "Reserved" } },
//   { id: 6, label: "Eyes — Colour (Sclera)", options: { vata: "Blackish", pitta: "Reddish / Brown", kapha: "Milky white, edges reddish" } },
//   { id: 7, label: "Lips — Character", options: { vata: "Cracked, shapeless", pitta: "Smooth, soft, thin", kapha: "Smooth, glossy, proportionate" } },
//   { id: 8, label: "Lips — Colour", options: { vata: "Blackish", pitta: "Reddish", kapha: "Pinkish" } },
//   { id: 9, label: "Nails — Character", options: { vata: "Small, cracking, breaking, rough", pitta: "Small, smooth & flat", kapha: "Big, smooth, glossy" } },
//   { id: 10, label: "Nails — Colour", options: { vata: "Blackish", pitta: "Reddish", kapha: "Pinkish" } },
//   { id: 11, label: "Hair — Texture", options: { vata: "Rough & Dry", pitta: "Soft & Delicate", kapha: "Soft & Shiny" } },
//   { id: 12, label: "Hair — Colour", options: { vata: "Black", pitta: "Gray / Brown", kapha: "Black" } },
//   { id: 13, label: "Hair — Thickness", options: { vata: "Less", pitta: "Medium", kapha: "More" } },
//   { id: 14, label: "Skin — Character", options: { vata: "Cracking, rough", pitta: "Soft, oily, moles, pimples/freckles", kapha: "Smooth, glossy" } },
//   { id: 15, label: "Skin — Colour", options: { vata: "Blackish tinge", pitta: "Yellowish tinge", kapha: "Fair, pinkish" } },
//   { id: 16, label: "Skin — Temperature", options: { vata: "Cold", pitta: "Warm", kapha: "Cold" } },
//   { id: 17, label: "Body odor", options: { vata: "Absent", pitta: "Present", kapha: "Absent" } },
//   { id: 18, label: "Appetite — Frequency of eating", options: { vata: "More", pitta: "More", kapha: "Less" } },
//   { id: 19, label: "Appetite — Quantity at meal", options: { vata: "Less", pitta: "More", kapha: "More" } },
//   { id: 20, label: "Appetite — Habit", options: { vata: "Irregular", pitta: "Profound symptoms if delayed", kapha: "No change" } },
//   { id: 21, label: "If meal timing changes or skipped", options: { vata: "Constipation", pitta: "Headache/vomiting", kapha: "Nothing special" } },
//   { id: 22, label: "Thirst", options: { vata: "Irregular", pitta: "More", kapha: "Less" } },
//   { id: 23, label: "Stool — Habit", options: { vata: "Irregular", pitta: "Regular", kapha: "Regular" } },
//   { id: 24, label: "Stool — Consistency", options: { vata: "Hard", pitta: "Semi-solid", kapha: "Well formed" } },
//   { id: 25, label: "Stool — Colour", options: { vata: "Blackish", pitta: "Yellowish", kapha: "Yellowish" } },
//   { id: 26, label: "Sleep — Character", options: { vata: "Interrupted", pitta: "Uninterrupted", kapha: "Deep & Sound" } },
//   { id: 27, label: "Sleep — Duration", options: { vata: "< 6 hours", pitta: "6–8 hours", kapha: "> 8 hours" } },
//   { id: 28, label: "Excitement", options: { vata: "Quickly excited & calms fast", pitta: "Quickly excited, slow calming", kapha: "Rarely excited" } },
//   { id: 29, label: "Working style", options: { vata: "Fast", pitta: "Medium", kapha: "Slow" } },
//   { id: 30, label: "Movement style", options: { vata: "Fast, unnecessary", pitta: "Fast, precise", kapha: "Slow, steady" } },
//   { id: 31, label: "Strength", options: { vata: "Low, exhausted", pitta: "Medium, moderate tired", kapha: "High, do not feel tired" } },
//   { id: 32, label: "Handling problems", options: { vata: "Worrying", pitta: "Losing self control, Irritated/angry", kapha: "Calm and stable mind" } },
//   { id: 33, label: "Control on desires", options: { vata: "Hard", pitta: "Moderate", kapha: "Easy" } },
//   { id: 34, label: "Concentration", options: { vata: "Poor", pitta: "Good when interested", kapha: "Excellent" } },
//   { id: 35, label: "Cognition — Grasping", options: { vata: "Quick, Poor", pitta: "Quick, Good", kapha: "Slow" } },
//   { id: 36, label: "Cognition — Store", options: { vata: "Poor", pitta: "Average", kapha: "Good" } },
//   { id: 37, label: "Memory", options: { vata: "Less", pitta: "Average", kapha: "Good" } },
// ]

// // --------------------------------------------------------------------
// // 2. MERGED COMPONENT
// // --------------------------------------------------------------------

// export default function BiochemicalWithPrakriti({
//   data,
//   onUpdateBiochemical,
//   initialSelections,
//   onUpdatePrakriti
// }: any) {
//   // --------------------------
//   // biochemical state
//   // --------------------------
//   const [formData, setFormData] = useState(data)

//   useEffect(() => {
//     setFormData(data)
//   }, [data])

//   const handleBioChange = (field: string, value: string) => {
//     const updated = { ...formData, [field]: value }
//     setFormData(updated)
//     onUpdateBiochemical?.(updated)
//   }

//   // --------------------------
//   // prakriti state
//   // --------------------------
//   const [selections, setSelections] = useState<SelectionMap>(() => {
//     const base: SelectionMap = {}
//     QUESTIONS.forEach((q) => {
//       base[q.id] = initialSelections?.[q.id] ?? {
//         vata: false,
//         pitta: false,
//         kapha: false,
//       }
//     })
//     return base
//   })

//   const toggle = (qid: number, dosha: OptionKey) => {
//     setSelections((prev) => ({
//       ...prev,
//       [qid]: { ...prev[qid], [dosha]: !prev[qid][dosha] },
//     }))
//   }

//   const computeTotals = () => {
//     let v = 0,
//       p = 0,
//       k = 0
//     Object.values(selections).forEach((s) => {
//       if (s.vata) v++
//       if (s.pitta) p++
//       if (s.kapha) k++
//     })
//     return { v, p, k, total: v + p + k }
//   }

//   const { v, p, k, total } = computeTotals()
//   const pct = (x: number) => (total ? Math.round((x / total) * 100) : 0)

//   const conclusion = (() => {
//     if (!total) return ""
//     const arr = [
//       { name: "Vata", pct: pct(v) },
//       { name: "Pitta", pct: pct(p) },
//       { name: "Kapha", pct: pct(k) },
//     ]
//     const primary = arr.filter((d) => d.pct >= 50)
//     if (primary.length === 1) return `${primary[0].name} Prakriti`
//     if (primary.length === 2) return `${primary[0].name}-${primary[1].name} Prakriti`
//     return "Tridoshic Prakriti"
//   })()

//       // ⬇️ SCROLL TO TOP WHEN COMPONENT LOADS ⬇️
//   // useEffect(() => {
//   //   window.scrollTo(0, 0);
//   // }, []);

//   useEffect(() => {
//     onUpdatePrakriti?.({
//       selections,
//       totalVata: v,
//       totalPitta: p,
//       totalKapha: k,
//       percentages: { vata: pct(v), pitta: pct(p), kapha: pct(k) },
//       conclusion,
//     })
//   }, [selections])

//   // --------------------------------------------------------------------
//   // RENDER
//   // --------------------------------------------------------------------

//   return (
//     <div className="space-y-8">

//       {/* --------------------------------------------------------------- */}
//       {/* BIOCHEMICAL ASSESSMENT */}
//       {/* --------------------------------------------------------------- */}
//       <Card className="border-slate-200">
//         <CardHeader className="bg-slate-50 border-b border-slate-200">
//           <CardTitle className="text-lg">Biochemical Assessment</CardTitle>
//           <CardDescription>Lipid, Glycemic & Genetic markers</CardDescription>
//         </CardHeader>

//         <CardContent className="space-y-8">
//           {/* Lipid Profile */}
//           <div>
//             <h3 className="font-semibold mb-4">Lipid Profile</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <Label>Total Cholesterol</Label>
//                 <Input
//                   value={formData.totalCholesterol ?? ""}
//                   onChange={(e) => handleBioChange("totalCholesterol", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>LDL</Label>
//                 <Input
//                   value={formData.ldl ?? ""}
//                   onChange={(e) => handleBioChange("ldl", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>HDL</Label>
//                 <Input
//                   value={formData.hdl ?? ""}
//                   onChange={(e) => handleBioChange("hdl", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>Triglycerides</Label>
//                 <Input
//                   value={formData.triglycerides ?? ""}
//                   onChange={(e) => handleBioChange("triglycerides", e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Glycemic */}
//           <div>
//             <h3 className="font-semibold mb-4">Glycemic Markers</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <Label>Fasting Glucose</Label>
//                 <Input
//                   value={formData.fastingGlucose ?? ""}
//                   onChange={(e) => handleBioChange("fastingGlucose", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>HbA1c</Label>
//                 <Input
//                   value={formData.hba1c ?? ""}
//                   onChange={(e) => handleBioChange("hba1c", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>Fasting Insulin</Label>
//                 <Input
//                   value={formData.fastingInsulin ?? ""}
//                   onChange={(e) => handleBioChange("fastingInsulin", e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Genetic */}
//           <div>
//             <h3 className="font-semibold mb-4">Genetic Markers</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <Label>FTO Gene Variant</Label>
//                 <Input
//                   value={formData.ftoGene ?? ""}
//                   onChange={(e) => handleBioChange("ftoGene", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>TCF7L2 Gene Variant</Label>
//                 <Input
//                   value={formData.tcf7l2Gene ?? ""}
//                   onChange={(e) => handleBioChange("tcf7l2Gene", e.target.value)}
//                 />
//               </div>
// //
//               <div>
//                 <Label>Lipid Profile Test</Label>
//                 <Input
//                   value={formData.LDLCho ?? ""}
//                   onChange={(e) => handleBioChange("LDLCho", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>Lipid Profile Test</Label>
//                 <Input
//                   value={formData.HDLCho ?? ""}
//                   onChange={(e) => handleBioChange("HDLCho", e.target.value)}
//                 />
//               </div>
// //
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* --------------------------------------------------------------- */}
//       {/* PRAKRITI QUESTIONNAIRE COLLAPSIBLE */}
//       {/* --------------------------------------------------------------- */}
//       <Accordion type="single" collapsible defaultValue="">
//         <AccordionItem value="prakriti">
//           <AccordionTrigger className="text-lg font-semibold">
//             TNMC Prakriti Questionnaire
//           </AccordionTrigger>

//           <AccordionContent>

//             <Card className="border-slate-200 mt-4">
//               <CardHeader className="bg-slate-50 border-b border-slate-200">
//                 <CardTitle className="text-lg">TNMC Prakriti Questionnaire</CardTitle>
//                 <CardDescription>Select all applicable options</CardDescription>
//               </CardHeader>

//               <CardContent className="pt-6 space-y-6">

//                 {QUESTIONS.map((q) => (
//                   <div key={q.id} className="border-b pb-4 grid grid-cols-1 md:grid-cols-12 gap-4">
//                     <div className="md:col-span-5 font-medium text-sm">
//                       {q.id}. {q.label}
//                     </div>

//                     <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2">
//                       {(["vata", "pitta", "kapha"] as OptionKey[]).map((key) => (
//                         <label key={key} className="flex gap-2 border rounded p-2 text-xs">
//                           <input
//                             type="checkbox"
//                             checked={selections[q.id][key]}
//                             onChange={() => toggle(q.id, key)}
//                           />
//                           <div>
//                             <div className="font-semibold capitalize">{key}</div>
//                             <div className="text-[11px] text-slate-600">{q.options[key]}</div>
//                           </div>
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 ))}

//                 {/* RESULTS */}
//                 <div className="p-4 border rounded-md bg-slate-50 space-y-3">
//                   <div className="font-semibold text-sm">Results</div>

//                   <div className="grid grid-cols-3 text-center">
//                     <div>
//                       <div className="text-xs text-slate-500">Vata</div>
//                       <div className="font-semibold text-lg">{v} ({pct(v)}%)</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-slate-500">Pitta</div>
//                       <div className="font-semibold text-lg">{p} ({pct(p)}%)</div>
//                     </div>
//                     <div>
//                       <div className="text-xs text-slate-500">Kapha</div>
//                       <div className="font-semibold text-lg">{k} ({pct(k)}%)</div>
//                     </div>
//                   </div>

//                   <div className="pt-3 border-t">
//                     <div className="text-xs text-slate-500">Conclusion</div>
//                     <div className="font-semibold text-base">{conclusion || "—"}</div>
//                   </div>
//                 </div>

//               </CardContent>
//             </Card>

//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//   )
// }
