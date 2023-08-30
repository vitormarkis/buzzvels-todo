import React, { createContext, useContext } from "react"

import { useAuth } from "@clerk/nextjs"
import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/use-toast"

import { createQueryCache } from "@/factories/createQueryCache"

import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { TaskSession } from "@/fetchs/tasks/schema"
import { MutateAddEndDateTask, MutateAddEndDateTaskInput } from "@/schemas/task/add-end-date"
import { addEndDateTaskMutationFunction } from "@/services/react-query/mutations/addEndDateTaskMutationFunction"

export interface ITaskContext {
  addEndDateMutate: UseMutateFunction<{}, {}, MutateAddEndDateTask, unknown>
  task: TaskSession
}

export const TaskContext = createContext({} as ITaskContext)

export function TaskProvider(props: { children: React.ReactNode; task: TaskSession }) {
  const { headers } = useUserInfo()
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const QueryCache = createQueryCache(queryClient, userId)

  const { mutate: addEndDateMutate } = useMutation<{}, {}, MutateAddEndDateTask>({
    mutationFn: payload => addEndDateTaskMutationFunction(payload, headers),
    onMutate: ({ taskId, endDate }) =>
      QueryCache.tasks.patch(taskId, currentTask => ({ ...currentTask, endDate })),
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to add an end date to this task",
        description: (
          <>
            Something went wrong on our server when adding end date to your task,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    retry: 2,
  })

  return (
    <TaskContext.Provider
      value={{
        addEndDateMutate,
        task: props.task,
      }}>
      {props.children}
    </TaskContext.Provider>
  )
}
