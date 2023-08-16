import { TodosGroupProvider } from "@/contexts/todos-group/todosGroupContext"
import { ThemeProvider } from "next-themes"
import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { UserInfoProvider } from "@/contexts/user-info/userInfoContext"
import { TasksListStateProvider } from "@/hooks/useTasksListState"

const queryClient = new QueryClient()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        <TasksListStateProvider>
          <UserInfoProvider>
            <TodosGroupProvider>{children}</TodosGroupProvider>
          </UserInfoProvider>
        </TasksListStateProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
