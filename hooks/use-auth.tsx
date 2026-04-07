"use client";
import { useState, useEffect, useContext, createContext, ReactNode } from 'react'

export type UserRole = 'employee' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  employeeId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "auth_user"

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem(STORAGE_KEY)
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    // Simple mock authentication - in production use real backend
    if (!email || !password) {
      throw new Error("Email and password required")
    }

    // Create mock user
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      name: email.split('@')[0],
      email,
      role,
      employeeId: role === 'employee' ? `EMP-${Math.random().toString(36).substring(7).toUpperCase()}` : undefined,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
