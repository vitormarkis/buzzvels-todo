import React, { createContext, useContext, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { CheckedState } from "@radix-ui/react-checkbox"
import {
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import {
  MutateDeleteTask,
  MutateToggleSubtask,
  MutateToggleTask,
} from "@/components/molecules/to-do/ToDo"
import { useToast } from "@/components/ui/use-toast"
import { createQueryCache } from "@/factories/createQueryCache"
import { useTasks } from "@/factories/createTasks"
import { useTasksListState } from "@/hooks/useTasksListState"
import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { getTasks } from "@/fetchs/tasks/get"
import { SubtaskAPI, TaskSession } from "@/fetchs/tasks/schema"
import { CreateNewTaskForm } from "@/form/create-new-task/schema"
import { MutateChangeSubtaskTextInput } from "@/schemas/subtask/change"
import { MutateChangeTaskTextInput } from "@/schemas/task/change"
import {
  MutateCreateNewSubtaskInput,
  changeSubtaskTextMutationFunction,
  changeTaskTextMutationFunction,
  createNewSubtaskMutationFunction,
  createNewTodoMutationFunction,
  deleteTaskMutationFunction,
  toggleSubtaskMutationFunction,
  toggleTaskMutationFunction,
} from "@/services/react-query/mutations"

type MutateCreateNewSubtaskInputPayload = MutateCreateNewSubtaskInput & {
  subtaskId: string
  isNewSubtaskDone: CheckedState
}

export interface ITasksContextContext {
  tasks: TaskSession[] | null
  isLoadingTasks: boolean
  backupTask: TaskSession | null
  setBackupTask: React.Dispatch<React.SetStateAction<TaskSession | null>>
  getCreateNewTodoMutate: (
    options?: UseMutationOptions<TaskSession, any, CreateNewTaskForm & { taskId: string }>
  ) => UseMutationResult<TaskSession, any, CreateNewTaskForm & { taskId: string }>
  getToggleTaskMutate: (
    options?: UseMutationOptions<{}, {}, MutateToggleTask>
  ) => UseMutationResult<{}, {}, MutateToggleTask>
  getToggleSubtaskMutate: (
    options?: UseMutationOptions<{}, {}, MutateToggleSubtask>
  ) => UseMutationResult<{}, {}, MutateToggleSubtask>
  getUseTasksQuery: (options?: UseQueryOptions<TaskSession[]>) => UseQueryResult<TaskSession[]>
  getDeleteTaskMutate: (
    options?: UseMutationOptions<{}, {}, MutateDeleteTask>
  ) => UseMutationResult<{}, {}, MutateDeleteTask>
  getChangeSubtaskTextMutate: (
    options?: UseMutationOptions<{}, {}, MutateChangeSubtaskTextInput>
  ) => UseMutationResult<{}, {}, MutateChangeSubtaskTextInput>
  getChangeTaskTextMutate: (
    options?: UseMutationOptions<{}, {}, MutateChangeTaskTextInput>
  ) => UseMutationResult<{}, {}, MutateChangeTaskTextInput>
  getCreateNewSubtaskMutate: (
    options?: UseMutationOptions<SubtaskAPI, {}, MutateCreateNewSubtaskInputPayload>
  ) => UseMutationResult<SubtaskAPI, {}, MutateCreateNewSubtaskInputPayload>
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

  const getToggleSubtaskMutate = React.useCallback(
    (options?: UseMutationOptions<{}, {}, MutateToggleSubtask>) => {
      const { onMutate, onError, retry = 2, ...mutateOptions } = options ?? {}

      return useMutation<{}, {}, MutateToggleSubtask>({
        mutationFn: payload => toggleSubtaskMutationFunction(payload, headers),
        onMutate: (...args) => {
          const [{ isDone, subtask }] = args
          if (onMutate) onMutate(...args)
          QueryCache.subtasks.toggle(isDone, subtask)
        },
        onError: (...args) => {
          if (onError) onError(...args)
          toast({
            variant: "destructive",
            title: "Failed to toggle sub-task",
            description: (
              <>
                Something went wrong on our server during the toggle of your sub-task,{" "}
                <strong>please try again.</strong>
              </>
            ),
          })
        },
        retry,
        ...mutateOptions,
      })
    },
    [toggleSubtaskMutationFunction, QueryCache, toast]
  )

  const getToggleTaskMutate = React.useCallback(
    (options?: UseMutationOptions<{}, {}, MutateToggleTask>) => {
      const { onError, onMutate, retry = 2, ...mutateOptions } = options ?? {}

      return useMutation<{}, {}, MutateToggleTask>({
        mutationFn: payload => toggleTaskMutationFunction(payload, headers),
        onMutate: (...args) => {
          const [{ isDone, taskId }] = args
          if (onMutate) onMutate(...args)

          QueryCache.tasks.toggle(taskId, isDone)
        },
        onError: (...args) => {
          if (onError) onError(...args)
          toast({
            variant: "destructive",
            title: "Failed to toggle task",
            description: (
              <>
                Something went wrong on our server during the toggle of your task,{" "}
                <strong>please try again.</strong>
              </>
            ),
          })
        },
        retry,
        ...mutateOptions,
      })
    },
    [toggleTaskMutationFunction, QueryCache, toast]
  )

  const getCreateNewTodoMutate = React.useCallback(
    (options?: UseMutationOptions<TaskSession, any, CreateNewTaskForm & { taskId: string }>) => {
      const { onError, onMutate, onSuccess, retry = 3, ...mutateOptions } = options ?? {}

      return useMutation<TaskSession, any, CreateNewTaskForm & { taskId: string }>({
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
        onMutate: (...args) => {
          const [{ endDate, task, taskId }] = args
          if (onMutate) onMutate(...args)
          QueryCache.tasks.add({
            endDate,
            task,
            id: taskId,
          })
        },
        onSuccess: (...args) => {
          const [{ createdAt, id }, { taskId }] = args
          if (onSuccess) onSuccess(...args)
          QueryCache.tasks.patch(taskId, currentTask => ({
            ...currentTask,
            createdAt,
            id,
          }))
        },
        retry,
        ...mutateOptions,
      })
    },
    [createNewTodoMutationFunction, QueryCache, toast]
  )

  const getDeleteTaskMutate = React.useCallback(
    (options?: UseMutationOptions<{}, {}, MutateDeleteTask>) => {
      const { onError, onMutate, retry = 3, ...mutateOptions } = options ?? {}

      return useMutation<{}, {}, MutateDeleteTask>({
        mutationFn: payload => deleteTaskMutationFunction(payload, headers),
        onMutate: (...args) => {
          const [{ taskId }] = args
          if (onMutate) onMutate(...args)
          QueryCache.tasks.remove(taskId)
        },
        onError: (...args) => {
          if (onError) onError(...args)
          toast({
            variant: "destructive",
            title: "Failed to delete task",
            description: (
              <>
                Something went wrong on our server during the deletion of your task,{" "}
                <strong>please try again.</strong>
              </>
            ),
          })
        },
        retry,
        ...mutateOptions,
      })
    },
    [deleteTaskMutationFunction, QueryCache, toast]
  )

  const getChangeSubtaskTextMutate = React.useCallback(
    (options?: UseMutationOptions<{}, {}, MutateChangeSubtaskTextInput>) => {
      const { onMutate, onError, retry = 3, ...mutateOptions } = options ?? {}

      return useMutation<{}, {}, MutateChangeSubtaskTextInput>({
        mutationFn: payload => changeSubtaskTextMutationFunction(payload, headers),
        onMutate: (...args) => {
          const [{ subtaskId, text }] = args
          if (onMutate) onMutate(...args)
          QueryCache.subtasks.changeText(subtaskId, text)
        },
        onError: (...args) => {
          if (onError) onError(...args)
          toast({
            variant: "destructive",
            title: "Failed to change sub-task text",
            description: (
              <>
                Something went wrong on our server during the change of your sub-task text,{" "}
                <strong>please try again.</strong>
              </>
            ),
          })
        },
        retry,
        ...mutateOptions,
      })
    },
    [changeSubtaskTextMutationFunction, QueryCache, toast]
  )

  const getChangeTaskTextMutate = React.useCallback(
    (options?: UseMutationOptions<{}, {}, MutateChangeTaskTextInput>) => {
      const { onMutate, onError, retry = 3, ...mutateOptions } = options ?? {}

      return useMutation<{}, {}, MutateChangeTaskTextInput>({
        mutationFn: payload => changeTaskTextMutationFunction(payload, headers),
        onMutate: (...args) => {
          const [{ taskId, text }] = args
          if (onMutate) onMutate(...args)

          QueryCache.tasks.changeText(taskId, text)
        },
        onError: (...args) => {
          if (onError) onError(...args)

          toast({
            variant: "destructive",
            title: "Failed to change task text",
            description: (
              <>
                Something went wrong on our server during the change of your task text,{" "}
                <strong>please try again.</strong>
              </>
            ),
          })
        },
        retry,
        ...mutateOptions,
      })
    },
    [changeTaskTextMutationFunction, QueryCache, toast]
  )

  const getCreateNewSubtaskMutate = React.useCallback(
    (options?: UseMutationOptions<SubtaskAPI, {}, MutateCreateNewSubtaskInputPayload>) => {
      const { onMutate, onSuccess, onError, retry = 3, ...mutateOptions } = options ?? {}
      return useMutation<SubtaskAPI, {}, MutateCreateNewSubtaskInputPayload>({
        mutationFn: ({ subtaskId, isNewSubtaskDone, ...props }) =>
          createNewSubtaskMutationFunction(props, headers),
        onMutate: (...args) => {
          const [{ taskId, task, subtaskId, isNewSubtaskDone }] = args
          if (onMutate) onMutate(...args)

          QueryCache.subtasks.add({
            id: subtaskId,
            isDone: !!isNewSubtaskDone,
            createdAt: new Date().getTime(),
            task,
            taskId,
          })
        },
        onError: (...args) => {
          if (onError) onError(...args)
          toast({
            variant: "destructive",
            title: "Failed to create sub-task",
            description: (
              <>
                Something went wrong on our server during the creation of your sub-task,{" "}
                <strong>please try again.</strong>
              </>
            ),
          })
        },
        onSuccess: (...args) => {
          const [{ createdAt, id }, { subtaskId, taskId }] = args
          if (onSuccess) onSuccess(...args)

          QueryCache.subtasks.patch(
            {
              taskId,
              subtaskId,
            },
            currentSubtask => ({
              ...currentSubtask,
              createdAt,
              id,
            })
          )
        },
        retry,
        ...mutateOptions,
      })
    },
    [createNewSubtaskMutationFunction, toast, QueryCache]
  )

  const getUseTasksQuery = React.useCallback(
    (options?: UseQueryOptions<TaskSession[]>) => {
      // const {
      //   staleTime = 1000 * 60,
      //   onError,
      //   enabled = !!userId,
      // refetchOnWindowFocus = false,
      //   retry = 3,
      //   ...queryOptions
      // } = options ?? {}
      const {
        refetchOnWindowFocus = false,
        onError,
        enabled = !!userId,
        retry = 3,
        ...queryOptions
      } = options ?? {}

      return useQuery<TaskSession[]>({
        queryKey: ["tasksIds", userId],
        queryFn: () => getTasks(headers),
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
        onError: (...args) => {
          if (onError) onError(...args)
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
        // ...queryOptions,
      })
    },
    [getTasks, toast, userId]
  )

  const { data: rawTasks, isLoading: isLoadingTasks } = getUseTasksQuery()

  const { tasks } = useTasks(rawTasks, {
    sortCurrent,
  })

  return (
    <TasksContextContext.Provider
      value={{
        tasks,
        isLoadingTasks,
        backupTask,
        setBackupTask,
        getUseTasksQuery,
        getCreateNewTodoMutate,
        getToggleTaskMutate,
        getToggleSubtaskMutate,
        getDeleteTaskMutate,
        getChangeSubtaskTextMutate,
        getChangeTaskTextMutate,
        getCreateNewSubtaskMutate,
      }}
    >
      {props.children}
    </TasksContextContext.Provider>
  )
}

export const useTasksContext = () => useContext(TasksContextContext)
