"use client";

import { AuthProvider } from "@/hooks/use-auth";
import ThemeToggle from "@/components/ThemeToggle";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {children}
    </AuthProvider>
  );
}
