import { z } from "zod"

import { Redis } from "@upstash/redis"

import { SubtaskSession, TaskSession, taskSchemaAPI } from "@/fetchs/tasks/schema"
import { subtaskSchemaAPI } from "@/schemas/subtask/create"

export interface GetTasksResponse {
  tasks: TaskSession[]
  failedToGetTasks: boolean
  errors: unknown[]
}

export async function getTasks(redis: Redis, userId: string): Promise<GetTasksResponse> {
  let errors = []
  const [tasksIds, subtasksIds] = await Promise.all([
    redis.lrange(`tasks:${userId}`, 0, -1),
    redis.lrange(`subtasks:${userId}`, 0, -1),
  ])

  const [unparsedTasks, unparsedSubtasks] = await Promise.all([
    Promise.all(tasksIds.map(taskId => redis.hgetall(taskId))),
    Promise.all(subtasksIds.map(subtaskId => redis.hgetall(subtaskId))),
  ])

  const tasksSafeParse = z.array(taskSchemaAPI).safeParse(unparsedTasks)
  const subtasksSafeParse = z.array(subtaskSchemaAPI).safeParse(unparsedSubtasks)

  const entitiesParsedSuccessfully = [tasksSafeParse, subtasksSafeParse].every(
    result => result.success
  )

  if (!tasksSafeParse.success) errors.push({ tasks: unparsedTasks, error: tasksSafeParse.error })
  if (!subtasksSafeParse.success)
    errors.push({ subtasks: unparsedSubtasks, error: subtasksSafeParse.error })

  const tasksRaw = tasksSafeParse.success ? tasksSafeParse.data : []
  const subtasksRaw = subtasksSafeParse.success ? subtasksSafeParse.data : []

  const tasks = mergeSubtasksToTasks(tasksRaw, subtasksRaw)

  return {
    failedToGetTasks: !entitiesParsedSuccessfully,
    tasks,
    errors,
  }
}

export function mergeSubtasksToTasks(
  tasks: Omit<TaskSession, "subtasks">[],
  subtasks: SubtaskSession[]
) {
  const subtasksEntries = subtasks.reduce(
    (newTasksAcc, subtask) => {
      const alreadyHasObjectWithTaskId = newTasksAcc.find(i => i.id === subtask.taskId)

      if (alreadyHasObjectWithTaskId) {
        newTasksAcc = newTasksAcc.map(taskWithSubtasks =>
          taskWithSubtasks.id === subtask.taskId
            ? {
                ...taskWithSubtasks,
                subtasks: [...taskWithSubtasks.subtasks, subtask],
              }
            : taskWithSubtasks
        )
      } else {
        newTasksAcc = [
          ...newTasksAcc,
          {
            id: subtask.taskId,
            subtasks: [subtask],
          },
        ]
      }

      return newTasksAcc
    },
    [] as Array<{
      id: string
      subtasks: SubtaskSession[]
    }>
  )

  return tasks.map(task => {
    const { subtasks = [] } = subtasksEntries.find(stEntry => stEntry.id === task.id) ?? {}
    return {
      ...task,
      subtasks,
    }
  })
}
