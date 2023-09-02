import { nanoid } from "nanoid"
import { NextApiRequest, NextApiResponse } from "next"
import { redis } from "@/lib/redis"
import { TaskAPI } from "@/fetchs/tasks/schema"
import { createNewTaskFormSchemaBody } from "@/form/create-new-task/schema"
import { getTasks } from "@/utils/api/getTasks"
import { bodyParser } from "@/utils/bodyParser"
import { getAuth } from "@/utils/getAuth"
import { getFailedJson } from "@/utils/getFailedJson"
import { handleOperationsSuccess } from "@/utils/handleOperationsSuccess"
import { performOperation } from "@/utils/performTransaction"
import { validateOperation } from "@/utils/validateOperation"

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

      // prettier-ignore
      const transaction = 
          redis
            .multi()
            .rpush(`tasks:${userId}`, taskId)
            .hset(taskId, taskAPI)
            .exec()

      const operation = await performOperation(() => transaction)
      if (!operation.success) return res.status(500).json(getFailedJson("task", req))

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
      const tasksFetch = await getTasks(redis, userId)

      const { operationSuccess } = validateOperation(tasksFetch)
      if (!operationSuccess) return res.status(500).json(getFailedJson("tasks", req))

      return res.status(200).json(tasksFetch.tasks)
    } catch (error) {
      return res.status(400).json({
        message: "Failed to retrieve tasks.",
        error,
      })
    }
  }
}
