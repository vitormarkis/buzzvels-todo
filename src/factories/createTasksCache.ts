import { QueryClient } from "@tanstack/react-query"

import { createQueryCacheGetters } from "@/factories/createQueryCacheGetters"

import { TaskSession } from "@/fetchs/tasks/schema"

type UserID = string | null | undefined

export function createTasksCache(queryClient: QueryClient, userId?: UserID) {
  const CacheGetters = createQueryCacheGetters(queryClient, userId)
  const { TASKS_QUERY_KEY } = CacheGetters.tasks.getQueryKey()
  const { tasks } = CacheGetters.tasks.get()

  const set = (tasks: TaskSession[]) => {
    queryClient.setQueryData(TASKS_QUERY_KEY, tasks)
  }

  const toggle = (taskId: string, isDone: boolean) => {
    const newTasks = tasks.map(toggledTask =>
      toggledTask.id === taskId
        ? {
            ...toggledTask,
            isDone,
          }
        : toggledTask
    )

    set(newTasks)
  }

  const changeText = (taskId: string, newText: string) => {
    const newTasks = tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            task: newText,
          }
        : task
    )

    set(newTasks)
  }

  const remove = (taskId: string) => {
    const newTasks = tasks.filter(toggledTask => toggledTask.id !== taskId)
    set(newTasks)
  }

  const sort = (sorterMethod: (a: TaskSession, b: TaskSession) => number) => {
    const newTasks = tasks.sort(sorterMethod)
    set(newTasks)
  }

  return {
    set,
    toggle,
    changeText,
    remove,
    sort,
  }
}
