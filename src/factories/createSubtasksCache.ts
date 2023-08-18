import { CheckedState } from "@radix-ui/react-checkbox"
import { QueryClient } from "@tanstack/react-query"

import { createQueryCacheGetters } from "@/factories/createQueryCacheGetters"
import { createTasksCache } from "@/factories/createTasksCache"

import { SubtaskSession, TaskSession } from "@/fetchs/tasks/schema"

type UserID = string | null | undefined
interface RemoveCallbacks {
  onRemoveLastOne?: () => void
}

export function createSubtasksCache(queryClient: QueryClient, userId?: UserID) {
  const CacheGetters = createQueryCacheGetters(queryClient, userId)
  const TasksCache = createTasksCache(queryClient, userId)
  const { tasks } = CacheGetters.tasks.get()

  const add = (newSubtask: SubtaskSession) => {
    const newTasks = tasks.map(
      (task): TaskSession =>
        newSubtask.taskId === task.id
          ? {
              ...task,
              subtasks: [...task.subtasks, newSubtask],
            }
          : task
    )
    TasksCache.set(newTasks)
  }

  const remove = (subtaskId: string, taskId: string, { onRemoveLastOne }: RemoveCallbacks = {}) => {
    const subtasksLength = tasks.find(task => task.id === taskId)?.subtasks.length

    const newTasks = tasks.map((task): TaskSession => {
      return taskId === task.id
        ? {
            ...task,
            subtasks: task.subtasks.filter(currentSubtask => currentSubtask.id !== subtaskId),
          }
        : task
    })

    if (subtasksLength === 1 && onRemoveLastOne) onRemoveLastOne()

    TasksCache.set(newTasks)
  }

  const toggle = (isDone: CheckedState, subtask: SubtaskSession) => {
    const newTasks = tasks.map((task): TaskSession => {
      return task.id === subtask.taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(currentSubtask =>
              currentSubtask.id === subtask.id
                ? {
                    ...currentSubtask,
                    isDone: typeof isDone === "string" ? false : isDone,
                  }
                : currentSubtask
            ),
          }
        : task
    })
    TasksCache.set(newTasks)
  }

  const changeText = (subtaskId: string, newText: string) => {
    const newTasks = tasks.map(task => ({
      ...task,
      subtasks: task.subtasks.map(subtask =>
        subtask.id === subtaskId
          ? {
              ...subtask,
              task: newText,
            }
          : subtask
      ),
    }))

    TasksCache.set(newTasks)
  }

  return {
    add,
    remove,
    toggle,
    changeText,
  }
}
