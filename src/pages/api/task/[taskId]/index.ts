import { NextApiRequest, NextApiResponse } from "next"

import { redis } from "@/lib/redis"

import { MutateChangeTaskTextInput, mutateChangeTaskTextSchema } from "@/schemas/task/change"
import { getAuth } from "@/utils/getAuth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

      const { userId } = auth
      const { taskId } = req.query as { taskId: string }

      const operationResponses = await Promise.all([
        redis.del(taskId),
        redis.lrem(`tasks:${userId}`, 1, taskId),
      ])

      const allOperationsSuccess = operationResponses.every(n => n === 0)

      if (allOperationsSuccess) {
        throw new Error("Failed to delete task.")
      }

      return res.status(200).json({
        message: "Delete task successfully.",
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to delete task.",
        error,
      })
    }
  }

  if (req.method === "PATCH") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

      const query = req.query as { taskId: string }
      const body = JSON.parse(req.body)

      const { taskId, text } = mutateChangeTaskTextSchema.parse({
        taskId: query.taskId,
        text: body.text,
      } satisfies MutateChangeTaskTextInput)

      const successResponse = await redis.hset(taskId, { task: text })

      if (successResponse !== 0) {
        throw new Error("Failed to change the task text.")
      }

      return res.status(200).json({
        message: "Change task text successfully.",
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to change the task text.",
        error,
      })
    }
  }
}
