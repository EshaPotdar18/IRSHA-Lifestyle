"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"employee" | "admin">("employee")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

    const validateEmail = (email: string) => {
    // 🆕 stronger real-world style email validator
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    return re.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

        // 🆕 real email check
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      setIsLoading(false)
      return
    }

    try {
      await login(email, password, role)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-center">
              {/* 🆕 wrapped logo with bg & bigger size */}
              <div className="flex justify-center mb-4 bg-blue-600 p-4 rounded-lg">
                <Image
                  src="/white-logo.png"
                  alt="Logo"
                  width={400}      // increased
                  height={400}     // increased
                  className="object-contain"
                />
              </div>
            <CardTitle className="text-2xl">Lifestyle Mapping Database</CardTitle>
            <CardDescription>
              Sign in to access the health assessment forms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Login As</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="employee"
                      checked={role === "employee"}
                      onChange={(e) => setRole(e.target.value as "employee" | "admin")}
                      disabled={isLoading}
                    />
                    <span className="text-sm">Employee</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="admin"
                      checked={role === "admin"}
                      onChange={(e) => setRole(e.target.value as "employee" | "admin")}
                      disabled={isLoading}
                    />
                    <span className="text-sm">Admin</span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
