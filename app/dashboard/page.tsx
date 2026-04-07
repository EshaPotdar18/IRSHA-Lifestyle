"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace("/login")
      return
    }

    if (user.role === "employee") {
      router.replace("/dashboard/employee")
    } else if (user.role === "admin") {
      router.replace("/dashboard/admin")
    }
  }, [user, isLoading, router])

  return (
    <p className="text-center mt-10 text-slate-600">Redirecting...</p>
  )
}
