import { QueryClient } from "@tanstack/react-query"

import { createQueryCacheGetters } from "@/factories/createQueryCacheGetters"
import { createSubtasksCache } from "@/factories/createSubtasksCache"
import { createTasksCache } from "@/factories/createTasksCache"

type UserID = string | null | undefined

export function createQueryCache(queryClient: QueryClient, userId?: UserID) {
  const tasks = createTasksCache(queryClient, userId)
  const subtasks = createSubtasksCache(queryClient, userId)
  const get = createQueryCacheGetters(queryClient, userId)

  return {
    tasks,
    subtasks,
    get,
  }
}
