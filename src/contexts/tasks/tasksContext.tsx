import React, { createContext, useContext, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { createQueryCache } from "@/factories/createQueryCache"
import { useTasks } from "@/factories/createTasks"
import { useTasksListState } from "@/hooks/useTasksListState"
import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { getTasks } from "@/fetchs/tasks/get"
import { TaskSession } from "@/fetchs/tasks/schema"
import { CreateNewTaskForm } from "@/form/create-new-task/schema"
import { createNewTodoMutationFunction } from "@/services/react-query/mutations"

export interface ITasksContextContext {
  useTasksQuery: UseQueryResult<TaskSession[], unknown>
  tasks: TaskSession[] | null
  backupTask: TaskSession | null
  setBackupTask: React.Dispatch<React.SetStateAction<TaskSession | null>>
  getCreateNewTodoMutate: (
    options?: UseMutationOptions<TaskSession, any, CreateNewTaskForm & { taskId: string }>
  ) => UseMutationResult<TaskSession, any, CreateNewTaskForm & { taskId: string }>
}

export const TasksContextContext = createContext({} as ITasksContextContext)

export function TasksContextProvider(props: { children: React.ReactNode }) {
  const [backupTask, setBackupTask] = useState<TaskSession | null>(null)

  const { userId } = useAuth()
  const { headers } = useUserInfo()
  const { sortCurrent } = useTasksListState()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const QueryCache = createQueryCache(queryClient, userId)

  const getCreateNewTodoMutate = React.useCallback(
    (options?: UseMutationOptions<TaskSession, any, CreateNewTaskForm & { taskId: string }>) => {
      const { onError, onMutate, onSuccess, retry, ...mutateOptions } = options ?? {}

      return useMutation<TaskSession, any, CreateNewTaskForm & { taskId: string }>({
        ...mutateOptions,
        mutationFn: ({ taskId, ...props }) => createNewTodoMutationFunction(props, headers),
        onError: (...args) => {
          if (onError) onError(...args)
          toast({
            variant: "destructive",
            title: "Failed to create task",
            description: (
              <>
                Something went wrong on our server during the creation of your task,{" "}
                <strong>please try again.</strong>
              </>
            ),
          })
        },
        onMutate: ({ endDate, task, taskId }, ...rest) => {
          if (onMutate) onMutate({ endDate, task, taskId }, ...rest)
          QueryCache.tasks.add({
            endDate,
            task,
            id: taskId,
          })
        },
        onSuccess: (data, variables, ...rest) => {
          const { createdAt, id } = data
          const { taskId } = variables
          if (onSuccess) onSuccess(data, variables, ...rest)
          QueryCache.tasks.patch(taskId, currentTask => ({
            ...currentTask,
            createdAt,
            id,
          }))
        },
        retry: retry ?? 3,
      })
    },
    [createNewTodoMutationFunction, QueryCache]
  )

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
        getCreateNewTodoMutate,
      }}
    >
      {props.children}
    </TasksContextContext.Provider>
  )
}

export const useTasksContext = () => useContext(TasksContextContext)
