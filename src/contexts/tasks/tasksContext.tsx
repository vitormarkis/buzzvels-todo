import { headers } from "next/headers"
import React, { createContext, useContext, useState } from "react"

import { useAuth } from "@clerk/nextjs"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"

import { useTasks } from "@/factories/createTasks"
import { useTasksListState } from "@/hooks/useTasksListState"

import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { getTasks } from "@/fetchs/tasks/get"
import { TaskSession } from "@/fetchs/tasks/schema"

export interface ITasksContextContext {
  useTasksQuery: UseQueryResult<TaskSession[], unknown>
  tasks: TaskSession[] | null
  backupTask: TaskSession | null
  setBackupTask: React.Dispatch<React.SetStateAction<TaskSession | null>>
}

export const TasksContextContext = createContext({} as ITasksContextContext)

export function TasksContextProvider(props: { children: React.ReactNode }) {
  const [backupTask, setBackupTask] = useState<TaskSession | null>(null)

  const { userId } = useAuth()
  const { headers } = useUserInfo()
  const { sortCurrent } = useTasksListState()

  const useTasksQuery = useQuery<TaskSession[]>({
    queryKey: ["tasksIds", userId],
    queryFn: () => getTasks(headers),
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to retrieve tasks",
        description: (
          <>
            Something went wrong on our server during the fetch of your tasks,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    enabled: !!userId,
    retry: 3,
  })

  const { tasks } = useTasks(useTasksQuery.data, {
    sortCurrent,
  })

  return (
    <TasksContextContext.Provider
      value={{
        useTasksQuery,
        tasks,
        backupTask,
        setBackupTask,
      }}>
      {props.children}
    </TasksContextContext.Provider>
  )
}

export const useTasksContext = () => useContext(TasksContextContext)
