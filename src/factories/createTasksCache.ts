import { QueryClient } from "@tanstack/react-query"
import { createQueryCacheGetters } from "@/factories/createQueryCacheGetters"
import { useTasksContext } from "@/contexts/tasks/tasksContext"
import { TaskSession } from "@/fetchs/tasks/schema"

type UserID = string | null | undefined

export function createTasksCache(queryClient: QueryClient, userId?: UserID) {
  const CacheGetters = createQueryCacheGetters(queryClient, userId)
  const { TASKS_QUERY_KEY } = CacheGetters.tasks.getQueryKey()

  const set = (tasks: TaskSession[]) => {
    queryClient.setQueryData(TASKS_QUERY_KEY, tasks)
  }

  const add = ({ endDate, task, id }: Pick<TaskSession, "endDate" | "task" | "id">) => {
    const { tasks } = CacheGetters.tasks.get()

    const newTasks = [
      {
        endDate,
        isDone: false,
        task,
        createdAt: new Date().getTime(),
        id,
        subtasks: [],
      } as TaskSession,
      ...tasks,
    ]

    set(newTasks)
  }

  const toggle = (taskId: string, isDone: boolean) => {
    const { tasks } = CacheGetters.tasks.get()

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
    const { tasks } = CacheGetters.tasks.get()

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
    const { tasks } = CacheGetters.tasks.get()

    const newTasks = tasks.filter(toggledTask => toggledTask.id !== taskId)
    set(newTasks)
  }

  const sort = (sorterMethod: (a: TaskSession, b: TaskSession) => number) => {
    const { tasks } = CacheGetters.tasks.get()

    const newTasks = tasks.sort(sorterMethod)
    set(newTasks)
  }

  const patch = (taskId: string, taskPatchCallback: (currentTask: TaskSession) => TaskSession) => {
    const { tasks } = CacheGetters.tasks.get()

    const newTasks = tasks.map(task => (task.id === taskId ? taskPatchCallback(task) : task))
    set(newTasks)
  }

  const put = (taskId: string, task: TaskSession) => {
    const { tasks } = CacheGetters.tasks.get()

    const newTasks = tasks.map(currentTask => (currentTask.id === taskId ? task : currentTask))
    set(newTasks)
  }

  return {
    set,
    toggle,
    changeText,
    remove,
    sort,
    add,
    patch,
    put,
  }
}
