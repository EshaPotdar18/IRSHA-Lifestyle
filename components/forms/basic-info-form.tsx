"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export interface BasicInfoValues {
  participantId: string | null
  name: string | null
  age: string | null
  gender: string | null
  dateOfBirth: string | null
  contactNumber: string | null
  email: string | null
  area: string | null
  city: string | null
  state: string | null
  pincode: string | null
  occupation: string | null
  travel: string | null
  maritalStatus: string | null
}

interface BasicInfoFormProps {
  data?: { values?: Partial<BasicInfoValues> }
  onUpdate?: (data: { values: BasicInfoValues }) => void
}

const DEFAULT_BASIC_INFO: BasicInfoValues = {
  participantId: null,
  name: null,
  age: null,
  gender: null,
  dateOfBirth: null,
  contactNumber: null,
  email: null,
  area: null,
  city: null,
  state: null,
  pincode: null,
  occupation: null,
  travel: null,
  maritalStatus: null,
}

const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh"
]

const occupationOptions = [
  "Household work",
  "Work from home",
  "Fix 9 to 5 job",
  "Physical labour",
  "Night shift"
]

const travelOptions = [
  "Never",
  "Once a week",
  "Twice weekly",
  "1-2 times a month",
  "Daily"
]

export default function BasicInfoForm({ data, onUpdate }: BasicInfoFormProps) {
  const [formData, setFormData] = useState<BasicInfoValues>({
    ...DEFAULT_BASIC_INFO,
    ...(data?.values || {}),
  })

    /* ✅ EMIT DEFAULTS ON FIRST LOAD (CRITICAL FIX) */
  useEffect(() => {
    onUpdate?.({ values: { ...formData } })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ⬇️ SCROLL TO TOP ON LOAD
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

   useEffect(() => {
    if (!data?.values) return
    setFormData(prev => ({ ...prev, ...data.values }))
  }, [data?.values])

    /* SINGLE UPDATE PIPE */
  const update = (updated: BasicInfoValues) => {
    setFormData(updated)
    onUpdate?.({ values: updated })
  }

    /* ---------------- PUSH TO PARENT (ALWAYS) ---------------- */

  const pushUpdate = (updated: BasicInfoValues) => {
    setFormData(updated)
    onUpdate?.({ values: updated })
  }

  const handleChange = (field: keyof BasicInfoValues, value: string) => {
    pushUpdate({
      ...formData,
      [field]: value === "" ? null : value,
    })
  }

  // AGE + DOB SYNC

  useEffect(() => {
  if (!formData.dateOfBirth) return

  const dob = new Date(formData.dateOfBirth)
  const today = new Date()

  let calculatedAge = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dob.getDate())
  ) {
    calculatedAge--
  }

  // Only update if different (prevents loop)
  if (String(calculatedAge) !== formData.age) {
    pushUpdate({ ...formData, age: String(calculatedAge) })
  }
}, [formData.dateOfBirth])

  const handleAgeKeyDown = (e: any) => {
    if (e.key === "Enter" && formData.age) {
      const currentYear = new Date().getFullYear()
      const birthYear = currentYear - Number(formData.age)
      alert(`Approx Birth Year: ${birthYear}`)
      handleChange("dateOfBirth", `${birthYear}-01-01`)
    }
  }

  // AUTO PINCODE
  useEffect(() => {
    const { area, city, state } = formData
    if (!area || !city || !state) return
    if (area.length < 3 || city.length < 3) return

    fetch(`https://api.postalpincode.in/postoffice/${area}`)
      .then(res => res.json())
      .then(data => {
        if (!data?.[0]?.PostOffice) return
        const match = data[0].PostOffice.find(
          (p: any) =>
            p.State.toLowerCase() === state.toLowerCase() &&
            p.District.toLowerCase() === city.toLowerCase()
        )
        if (match?.Pincode) {
          pushUpdate({ ...formData, pincode: match.Pincode })
        }
      })
      .catch(() => {})
  }, [formData.area, formData.city, formData.state])

  // const handleChange = (field: string, value: string) => {
  //   setFormData(prev => {
  //     const updated = { ...prev, [field]: value }
  //     onUpdate(updated)
  //     return updated
  //   })
  // }

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
                Basic Information - Participant Form
              </h1>
              <p className="text-sm text-slate-600 mt-1">Complete Basic Information of Participant</p>
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

        {/* Personal Info Card */}
        <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
          <CardHeader className="bg-transparent border-b-0 px-6">
            <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M7 7h10" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Personal Information
            </CardTitle>
            <CardDescription className="text-slate-600">Please provide your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Participant ID */}
              <div className="space-y-2">
                <Label htmlFor="participantId" className="text-slate-700 font-medium">Participant ID</Label>
                <Input
                  id="participantId"
                  placeholder="e.g., BVDU-001"
                  value={formData.participantId || ""}
                  onChange={e => handleChange("participantId", e.target.value)}
                  className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name || ""}
                  onChange={e => handleChange("name", e.target.value)}
                  required
                  className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* DOB */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-slate-700 font-medium">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={e => handleChange("dateOfBirth", e.target.value)}
                  required
                  className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-slate-700 font-medium">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={formData.age || ""}
                  onChange={e => handleChange("age", e.target.value)}
                  onKeyDown={handleAgeKeyDown}
                  className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700 font-medium">Gender *</Label>
                <RadioGroup
                  value={formData.gender || ""}
                  onValueChange={value => handleChange("gender", value)}
                  className="flex gap-3"
                >
                  {["male","female","other"].map(g => (
                    <div key={g} className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
                      <RadioGroupItem
                    value={g}
                    id={g}
                    className="
                      h-4 w-4
                      border-2 border-slate-400
                      text-blue-600
                      focus:ring-2 focus:ring-blue-300
                    "
                  />
                      <Label htmlFor={g} className="text-slate-700 capitalize">{g}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Marital Status */}
              <div className="space-y-2">
                <Label htmlFor="maritalStatus" className="text-slate-700 font-medium">Marital Status</Label>
                <Select
                  value={formData.maritalStatus || ""}
                  onValueChange={value => handleChange("maritalStatus", value)}
                >
                  <SelectTrigger className="border-slate-300 rounded-lg shadow-sm bg-white h-11">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-md bg-white">
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="text-slate-700 font-medium">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  maxLength={10}
                  type="text"
                  pattern="\d{10}"
                  placeholder="Enter 10-digit phone number"
                  value={formData.contactNumber || ""}
                  onChange={e => handleChange("contactNumber", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  required
                  className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={e => handleChange("email", e.target.value)}
                  className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>

              {/* Occupation */}
              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-slate-700 font-medium">Occupation</Label>
                <Select
                  value={formData.occupation || ""}
                  onValueChange={value => handleChange("occupation", value)}
                >
                  <SelectTrigger className="border-slate-300 rounded-lg shadow-sm bg-white h-11">
                    <SelectValue placeholder="Select occupation" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-md bg-white">
                    {occupationOptions.map(occ => <SelectItem key={occ} value={occ}>{occ}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Travel */}
              <div className="space-y-2">
                <Label htmlFor="travel" className="text-slate-700 font-medium">Traveling for Work</Label>
                <Select
                  value={formData.travel || ""}
                  onValueChange={value => handleChange("travel", value)}
                >
                  <SelectTrigger className="border-slate-300 rounded-lg shadow-sm bg-white h-11">
                    <SelectValue placeholder="Select travel frequency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-md bg-white">
                    {travelOptions.map(trav => <SelectItem key={trav} value={trav}>{trav}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card className="border-0 shadow-md overflow-visible" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(245,250,255,0.85))" }}>
          <CardHeader className="bg-transparent border-b-0 px-6">
            <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v18" stroke="#60a5fa" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M3 12h18" stroke="#3b82f6" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Area</Label>
                <Input
                  value={formData.area || ""}
                  onChange={e => handleChange("area", e.target.value)}
                  className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city || ""}
                  onChange={e => handleChange("city", e.target.value)}
                  className="border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 transition"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select
                  value={formData.state || ""}
                  onValueChange={value => handleChange("state", value)}
                >
                  <SelectTrigger className="border-slate-300 rounded-lg shadow-sm bg-white h-11">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-52 overflow-y-auto rounded-lg shadow-md bg-white">
                    {indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input
                  readOnly
                  value={formData.pincode || ""}
                  className="bg-slate-100 border-slate-300 rounded-lg shadow-inner"
                />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}


// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// interface BasicInfoData {
//   participantId?: string
//   name?: string
//   age?: string
//   gender?: string
//   dateOfBirth?: string
//   contactNumber?: string
//   email?: string
//   area?: string
//   city?: string
//   state?: string
//   pincode?: string
//   occupation?: string
//   travel?: string
//   maritalStatus?: string
// }

// interface BasicInfoFormProps {
//   data: BasicInfoData
//   onUpdate: (data: BasicInfoData) => void
// }

// const indianStates = [
//   "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
//   "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
//   "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
//   "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu and Kashmir","Ladakh"
// ]

// const occupationOptions = [
//   "Household work",
//   "Work from home",
//   "Fix 9 to 5 job",
//   "Physical labour",
//   "Night shift"
// ]

// const travelOptions = [
//   "Never",
//   "Once a week",
//   "Twice weekly",
//   "1-2 times a month",
//   "Daily"
// ]

// export default function BasicInfoForm({ data, onUpdate }: BasicInfoFormProps) {
//   const [formData, setFormData] = useState<BasicInfoData>(data || {})

//   // ⬇️ SCROLL TO TOP WHEN COMPONENT LOADS ⬇️
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     setFormData(data || {})
//   }, [data])

//   // AGE + DOB SYNC FIXED
//   useEffect(() => {
//     if (formData.dateOfBirth && !formData.age) {
//       const birthYear = new Date(formData.dateOfBirth).getFullYear()
//       const currentYear = new Date().getFullYear()
//       handleChange("age", String(currentYear - birthYear))
//     }

//   }, [formData.dateOfBirth, formData.age])

//   const handleAgeKeyDown = (e: any) => {
//   if (e.key === "Enter" && formData.age) {
//     const currentYear = new Date().getFullYear();
//     const birthYear = currentYear - Number(formData.age);
//     alert(`Approx Birth Year: ${birthYear}`);

//     // update DOB also
//     handleChange("dateOfBirth", `${birthYear}-01-01`);
//   }
// };

//   // AUTO PINCODE + STATE + CITY FROM POSTAL API
//   useEffect(() => {
//     const { area, city, state } = formData;

//     if (!area || !city || !state) return;
//     if (area.length < 3 || city.length < 3) return;

//     fetch(`https://api.postalpincode.in/postoffice/${area}`)
//       .then(res => res.json())
//       .then(data => {
//         if (!data?.[0]?.PostOffice) return;

//         const match = data[0].PostOffice.find(
//           (p: any) =>
//             p.State.toLowerCase() === state.toLowerCase() &&
//             p.District.toLowerCase() === city.toLowerCase()
//         );

//         if (match) {
//           handleChange("pincode", match.Pincode);
//         }
//       })
//       .catch(() => {});
//   }, [formData.area, formData.city, formData.state]);

//   const handleChange = (field: string, value: string) => {
//     setFormData(prev => {
//       const updated = { ...prev, [field]: value }
//       onUpdate(updated)
//       return updated
//     })
//   }

//   return (
// <div className="space-y-6 bg-slate-50 p-5 rounded-xl">
//   <Card className="border-slate-300 shadow-md rounded-xl bg-white overflow-hidden !mt-0">
//     <CardHeader
//       className="px-4 py-4 !pt-3 !mt-0 rounded-t-xl border-b border-blue-400
//                  bg-[#0A2A5A] relative overflow-hidden"
//     >

//           {/* Neon moving beam */}
//           <div className="absolute inset-0 bg-gradient-to-r 
//                           from-transparent via-blue-300/40 to-transparent
//                           animate-[neon_4s_linear_infinite]" />
//                 <CardTitle className="relative z-10 text-lg font-semibold 
//                               text-cyan-100 drop-shadow-[0_0_4px_#22d3ee]">
//           Personal Information
//         </CardTitle>

//         <CardDescription className="relative z-10 text-sm 
//                                     text-cyan-100/90 drop-shadow-[0_0_3px_#22d3ee]">
//           Please provide your basic personal details
//           </CardDescription>
//       </CardHeader>


//         <CardContent className="">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
//             <div className="space-y-2">
//               <Label htmlFor="participantId" className="text-slate-700 font-medium">
//                 Participant ID
//               </Label>
//               <Input
//                 id="participantId"
//                 placeholder="e.g., BVDU-001"
//                 value={formData.participantId || ""}
//                 onChange={(e) => handleChange("participantId", e.target.value)}
//                 className="border-slate-300 bg-white shadow-sm rounded-md"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="name" className="text-slate-700 font-medium">
//                 Full Name *
//               </Label>
//               <Input
//                 id="name"
//                 placeholder="Enter your full name"
//                 value={formData.name || ""}
//                 onChange={(e) => handleChange("name", e.target.value)}
//                 required
//                 className="border-slate-300 bg-white shadow-sm rounded-md"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="dateOfBirth" className="text-slate-700 font-medium">
//                 Date of Birth *
//               </Label>
//               <Input
//                 id="dateOfBirth"
//                 type="date"
//                 value={formData.dateOfBirth || ""}
//                 onChange={(e) => handleChange("dateOfBirth", e.target.value)}
//                 required
//                 className="border-slate-300 bg-white shadow-sm rounded-md"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="age" className="text-slate-700 font-medium">
//                 Age (years)
//               </Label>
//               <Input
//                 id="age"
//                 type="number"
//                 placeholder="Enter age"
//                 value={formData.age || ""}
//                 onChange={(e) => handleChange("age", e.target.value)}
//                 onKeyDown={handleAgeKeyDown}
//                 className="border-slate-300 bg-white shadow-sm rounded-md"
//               />

//             </div>

//             {/* BEAUTIFIED RADIO BUTTONS */}
//             <div className="space-y-3">
//               <Label className="text-slate-700 font-medium">Gender *</Label>
//               <RadioGroup
//                 value={formData.gender || ""}
//                 onValueChange={(value) => handleChange("gender", value)}
//                 className="flex gap-3"
//               >
//                 {["male","female","other"].map(g => (
//                   <div key={g} className="flex items-center space-x-3 p-2 rounded-md border border-slate-200 bg-slate-50">
//                     <RadioGroupItem
//                       value={g}
//                       id={g}
//                       className="border-2 h-4 w-4"
//                     />
//                     <Label htmlFor={g} className="text-slate-700 capitalize">
//                       {g}
//                     </Label>
//                   </div>
//                 ))}
//               </RadioGroup>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="maritalStatus" className="text-slate-700 font-medium">
//                 Marital Status
//               </Label>
//               <Select
//                 value={formData.maritalStatus || ""}
//                 onValueChange={(value) => handleChange("maritalStatus", value)}
//               >
//                 <SelectTrigger className="border-slate-300 rounded-md shadow-sm bg-white h-11">
//                   <SelectValue placeholder="Select marital status" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-md shadow-md bg-white">
//                   <SelectItem value="single">Single</SelectItem>
//                   <SelectItem value="married">Married</SelectItem>
//                   <SelectItem value="divorced">Divorced</SelectItem>
//                   <SelectItem value="widowed">Widowed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="contactNumber" className="text-slate-700 font-medium">
//                 Contact Number *
//               </Label>
//               <Input
//                 id="contactNumber"
//                 maxLength={10}
//                 type="text"
//                 pattern="\d{10}"
//                 placeholder="Enter 10-digit phone number"
//                 value={formData.contactNumber || ""}
//                 onChange={(e) =>
//                   handleChange("contactNumber", e.target.value.replace(/\D/g, "").slice(0, 10))
//                 }
//                 required
//                 className="border-slate-300 bg-white shadow-sm rounded-md"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-slate-700 font-medium">
//                 Email Address
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email || ""}
//                 onChange={(e) => handleChange("email", e.target.value)}
//                 className="border-slate-300 bg-white shadow-sm rounded-md"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="occupation" className="text-slate-700 font-medium">
//                 Occupation
//               </Label>
//               <Select
//                 value={formData.occupation || ""}
//                 onValueChange={(value) => handleChange("occupation", value)}
//               >
//                 <SelectTrigger className="border-slate-300 rounded-md shadow-sm bg-white h-11">
//                   <SelectValue placeholder="Select occupation" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-md shadow-md bg-white">
//                   {occupationOptions.map((occ) => (
//                     <SelectItem key={occ} value={occ}>{occ}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="travel" className="text-slate-700 font-medium">
//                 Traveling for Work
//               </Label>
//               <Select
//                 value={formData.travel || ""}
//                 onValueChange={(value) => handleChange("travel", value)}
//               >
//                 <SelectTrigger className="border-slate-300 rounded-md shadow-sm bg-white h-11">
//                   <SelectValue placeholder="Select travel frequency" />
//                 </SelectTrigger>
//                 <SelectContent className="rounded-md shadow-md bg-white">
//                   {travelOptions.map((trav) => (
//                     <SelectItem key={trav} value={trav}>{trav}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//           </div>
//         </CardContent>
//       </Card>

//       {/* ADDRESS */}
//        <Card className="border-slate-300 shadow-md rounded-xl bg-white overflow-hidden !mt-0">
//     <CardHeader
//       className="px-4 py-4 !pt-3 !mt-0 rounded-t-xl border-b border-blue-400
//                  bg-[#0A2A5A] relative overflow-hidden"
//     >

//           {/* Neon moving beam */}
//           <div className="absolute inset-0 bg-gradient-to-r 
//                           from-transparent via-blue-300/40 to-transparent
//                           animate-[neon_4s_linear_infinite]" />
//                 <CardTitle className="relative z-10 text-lg font-semibold 
//                               text-cyan-100 drop-shadow-[0_0_4px_#22d3ee]">
//           Address Information
//         </CardTitle>
//       </CardHeader>



//         <CardContent className="">
//           <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

//             <div className="space-y-2">
//               <Label>Area</Label>
//               <Input
//                 value={formData.area || ""}
//                 onChange={(e) => handleChange("area", e.target.value)}
//                 className="border-slate-300 bg-white shadow-sm rounded-md"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>City</Label>
//               <Input
//                 value={formData.city || ""}
//                 onChange={(e) => handleChange("city", e.target.value)}
//                 className="border-slate-300 bg-white shadow-sm rounded-md"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>State</Label>
//               <Select
//                 value={formData.state || ""}
//                 onValueChange={(value) => handleChange("state", value)}
//               >
//                 <SelectTrigger className="border-slate-300 rounded-md shadow-sm bg-white h-11">
//                   <SelectValue placeholder="Select state" />
//                 </SelectTrigger>

//                 {/* SCROLL ADDED */}
//                 <SelectContent className="max-h-52 overflow-y-auto rounded-md shadow-md bg-white">
//                   {indianStates.map((state) => (
//                     <SelectItem key={state} value={state}>{state}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label>Pincode</Label>
//               <Input
//                 readOnly
//                 className="bg-slate-100 border-slate-300 shadow-sm rounded-md"
//                 value={formData.pincode || ""}
//               />
//             </div>

//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
