import type { Metadata } from 'next'
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import ThemeToggle from "@/components/ThemeToggle";
import Providers from "./providers"; // ✅ correct
import { AuthProvider } from "@/hooks/use-auth"

export const metadata: Metadata = {
  title: "Health Assessment App",
  description: "Prediabetes assessment platform",
  generator: 'v0.app'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gray-900 dark:text-slate-100 transition-colors duration-300">
             
        {/* 👇 ADD THIS */}
        <div className="background-icons">
          <span>⚕️</span>
          <span>💉</span>
          <span>🧬</span>
          <span>🧪</span>
          <span>💊</span>
          <span>🏥</span>
          <span>➕</span>
          <span>🩹</span>
          <span>🧬</span>
          <span>🩺</span>
        </div>
        <Providers>   {/* ⬅ wrap everything in our Client Provider */}
          <AuthProvider>
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            {children}
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
