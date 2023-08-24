import { QueryClient } from "@tanstack/react-query"

import { TaskSession } from "@/fetchs/tasks/schema"

type UserID = string | null | undefined

export function createQueryCacheGetters(queryClient: QueryClient, userId?: UserID) {
  const TASKS_QUERY_KEY = ["tasksIds", userId]

  const tasks = {
    get: () => {
      const tasks = (queryClient.getQueryData(TASKS_QUERY_KEY) as TaskSession[] | undefined) ?? []
      return {
        tasks,
      }
    },
    getQueryKey: () => ({
      TASKS_QUERY_KEY,
    }),
  }

  return {
    tasks,
  }
}
