"use client"
import { TodosGroupProvider } from "@/contexts/todos-group/todosGroupContext"
import { ThemeProvider } from "next-themes"
import React from "react"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <TodosGroupProvider>{children}</TodosGroupProvider>
    </ThemeProvider>
  )
}
