import { nanoid } from "nanoid"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

import { redis } from "@/lib/redis"

import { SubtaskSession, TaskAPI, subtaskSchema, taskSchemaAPI } from "@/fetchs/tasks/schema"
import { createNewTaskFormSchema } from "@/form/create-new-task/schema"
import { getAuth } from "@/utils/getAuth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const [{ responseNotAuth, json }, { userId }] = getAuth(req, res)
    if (responseNotAuth) return responseNotAuth.json(json)

    const { endDate, task } = createNewTaskFormSchema.parse(JSON.parse(req.body))

    const taskId = `task_${nanoid()}`

    const taskAPI: TaskAPI = {
      endDate,
      isDone: false,
      task,
      createdAt: new Date().getTime(),
      id: taskId,
    }

    await redis.rpush(`tasks:${userId}`, taskId)
    await redis.hset(taskId, taskAPI)

    return res.status(201).json(task)
  }

  if (req.method === "GET") {
    try {
      let errors: unknown[] = []
      const [{ responseNotAuth, json }, { userId }] = getAuth(req, res)
      if (responseNotAuth) return responseNotAuth.json(json)

      const [tasksIds, subtasksIds] = await Promise.all([
        redis.lrange(`tasks:${userId}`, 0, -1),
        redis.lrange(`subtasks:${userId}`, 0, -1),
      ])

      const [unparsedTasks, unparsedSubtasks] = await Promise.all([
        Promise.all(tasksIds.map(taskId => redis.hgetall(taskId))),
        Promise.all(subtasksIds.map(subtaskId => redis.hgetall(subtaskId))),
      ])

      const tasksSafeParse = z.array(taskSchemaAPI).safeParse(unparsedTasks)
      const subtasksSafeParse = z.array(subtaskSchema).safeParse(unparsedSubtasks)

      const entitiesParsedSuccessfully = [tasksSafeParse, subtasksSafeParse].every(
        result => result.success
      )

      if (!tasksSafeParse.success)
        errors.push({ tasks: unparsedTasks, error: tasksSafeParse.error })
      if (!subtasksSafeParse.success)
        errors.push({ subtasks: unparsedSubtasks, error: subtasksSafeParse.error })

      const tasks = tasksSafeParse.success ? tasksSafeParse.data : []
      const subtasks = subtasksSafeParse.success ? subtasksSafeParse.data : []

      if (!entitiesParsedSuccessfully) {
        return res.status(400).json({
          message: "Failed to retrieve tasks.",
          tasks,
          subtasks,
          errors,
        })
      }

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

      const tasksWithSubtasks = tasks.map(task => {
        const { subtasks = [] } = subtasksEntries.find(stEntry => stEntry.id === task.id) ?? {}
        return {
          ...task,
          subtasks,
        }
      })

      return res.status(201).json(tasksWithSubtasks)
    } catch (error) {
      return res.status(400).json({
        message: "Failed to retrieve tasks.",
        error,
      })
    }
  }
}
