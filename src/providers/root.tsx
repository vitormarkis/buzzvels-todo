import { TodosGroupProvider } from "@/contexts/todos-group/todosGroupContext"
import { ThemeProvider } from "next-themes"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { UserInfoProvider } from "@/contexts/user-info/userInfoContext"

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <UserInfoProvider>
          <TodosGroupProvider>{children}</TodosGroupProvider>
        </UserInfoProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
