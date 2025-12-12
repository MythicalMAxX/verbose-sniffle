"use client"

import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { Toaster } from "@/components/ui/toaster"
import { type ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryProvider>
  )
}
