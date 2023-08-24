import { nanoid } from "nanoid"
import { NextApiRequest, NextApiResponse } from "next"

import { redis } from "@/lib/redis"

import { TaskAPI } from "@/fetchs/tasks/schema"
import { createNewTaskFormSchemaBody } from "@/form/create-new-task/schema"
import { getTasks } from "@/utils/api/getTasks"
import { bodyParser } from "@/utils/bodyParser"
import { getAuth } from "@/utils/getAuth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

      const bodyParsed = bodyParser(req, createNewTaskFormSchemaBody)
      if (!bodyParsed.parse.success) return res.status(400).json(bodyParsed.json)

      const { userId } = auth
      const { endDate, task } = bodyParsed.parse.data

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

      return res.status(201).json(taskAPI)
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong during the creation of the task.",
        error,
      })
    }
  }

  if (req.method === "GET") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

      const { userId } = auth
      const { tasks, failedToGetTasks, errors } = await getTasks(redis, userId)

      if (failedToGetTasks) {
        return res.status(400).json({
          message: "Failed to retrieve tasks.",
          tasks,
          errors,
        })
      }

      return res.status(200).json(tasks)
    } catch (error) {
      return res.status(400).json({
        message: "Failed to retrieve tasks.",
        error,
      })
    }
  }
}
