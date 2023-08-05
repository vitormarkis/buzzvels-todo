"use client"
import { TodosGroupProvider } from "@/contexts/todos-group/todosGroupContext"
import { ThemeProvider } from "next-themes"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <TodosGroupProvider>{children}</TodosGroupProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
