import { SortAllKeysValid, SortCurrent, useTasksListState } from "@/hooks/useTasksListState"
import { TaskSession } from "@/fetchs/tasks/schema"

type TasksOptions = {
  sortCurrent: SortCurrent
}
type TaskSorter = Record<SortAllKeysValid, (a: TaskSession, b: TaskSession) => number>

const tasksSorterMethods: TaskSorter = {
  "createdAt-asc": (a: TaskSession, b: TaskSession) => b.createdAt - a.createdAt,
  "createdAt-desc": (a: TaskSession, b: TaskSession) => a.createdAt - b.createdAt,
  "expiresAt-asc": (a: TaskSession, b: TaskSession) => {
    if (!a.endDate) return 1
    if (!b.endDate) return -1
    return b.endDate - a.endDate
  },
  "expiresAt-desc": (a: TaskSession, b: TaskSession) => {
    if (a.endDate && b.endDate) {
      const now = new Date().getTime()
      let aEndDate = new Date(a.endDate).getTime()
      let bEndDate = new Date(b.endDate).getTime()

      if (aEndDate > now && bEndDate > now) {
        return aEndDate - bEndDate
      }

      if (aEndDate < now && bEndDate < now) {
        return bEndDate - aEndDate
      }

      return aEndDate > now ? -1 : 1
    } else {
      return a.endDate ? -1 : b.endDate ? 1 : 0
    }
  },
  "text-asc": (a: TaskSession, b: TaskSession) =>
    a.task.toLowerCase() > b.task.toLowerCase()
      ? 1
      : a.task.toLowerCase() < b.task.toLowerCase()
      ? -1
      : 0,
  "text-desc": (a: TaskSession, b: TaskSession) =>
    a.task.toLowerCase() > b.task.toLowerCase()
      ? -1
      : a.task.toLowerCase() < b.task.toLowerCase()
      ? 1
      : 0,
  "isDone-asc": (a: TaskSession, b: TaskSession) => Number(a.isDone) - Number(b.isDone),
  "isDone-desc": (a: TaskSession, b: TaskSession) => Number(b.isDone) - Number(a.isDone),
}

export type SortMethodName = keyof typeof tasksSorterMethods

export function useTasks(rawTasks: TaskSession[] | undefined, options: TasksOptions) {
  // export function useTasks(rawTasks: TaskSession[] | undefined, sortMethodName: SortMethodName) {
  const { date, text, isDone } = options.sortCurrent
  const { lastSort } = useTasksListState()
  let tasks: TaskSession[] | null = rawTasks ?? null
  if (!tasks) return { tasks: null }

  if (date && date === lastSort) tasks = tasks.sort(tasksSorterMethods[date])
  if (text && text === lastSort) tasks = tasks.sort(tasksSorterMethods[text])
  if (isDone && isDone === lastSort) tasks = tasks.sort(tasksSorterMethods[isDone])

  return { tasks }
}
