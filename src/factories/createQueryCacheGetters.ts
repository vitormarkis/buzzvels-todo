import { TaskSession } from "@/fetchs/tasks/schema"
import { QueryClient } from "@tanstack/react-query"

type UserID = string | null | undefined

export function createQueryCacheGetters(queryClient: QueryClient, userId?: UserID) {
  const TASKS_QUERY_KEY = ["tasksIds", userId]

  const tasks = {
    get: () => {
      const tasks = queryClient.getQueryData(TASKS_QUERY_KEY) as TaskSession[]
      if (!tasks)
        throw new Error("You're trying to mutate tasks cache, but no tasks cache was found.")
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
