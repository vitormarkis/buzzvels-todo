"use client"
import { ThemeProvider } from "next-themes"
import React from "react"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>
}
