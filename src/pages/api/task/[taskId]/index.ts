import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import { redis } from "@/lib/redis"
import { MutateChangeTaskTextInput, mutateChangeTaskTextSchema } from "@/schemas/task/change"
import { bodyParser } from "@/utils/bodyParser"
import { getAuth } from "@/utils/getAuth"
import { getFailedJson } from "@/utils/getFailedJson"
import { handleOperationsSuccess } from "@/utils/handleOperationsSuccess"
import { performOperation } from "@/utils/performTransaction"
import { queryParser } from "@/utils/queryParser"

const querySchema = z.object({ taskId: z.string() })

export const taskPATCHBodySchema = mutateChangeTaskTextSchema.pick({
  text: true,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

      const { userId } = auth

      const queryParsed = queryParser(req, querySchema)
      if (!queryParsed.parse.success) return res.status(400).json(queryParsed.json)
      const { taskId } = queryParsed.parse.data

      // prettier-ignore
      const transaction =
        redis
          .multi()
          .del(taskId)
          .lrem(`tasks:${userId}`, 1, taskId)
          .exec()

      const operation = await performOperation(() => transaction)
      if (!operation.success) return res.status(500).json(getFailedJson("task", req))

      return res.status(200).json({
        message: "Task deleted with success!",
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

      const queryParsed = queryParser(req, querySchema)
      if (!queryParsed.parse.success) return res.status(400).json(queryParsed.json)

      const bodyParsed = bodyParser(req, taskPATCHBodySchema)
      if (!bodyParsed.parse.success) return res.status(400).json(bodyParsed.json)

      const { taskId } = queryParsed.parse.data
      const { text } = bodyParsed.parse.data

      const operations = redis.hset(taskId, { task: text })

      const operation = await performOperation(() => operations)
      if (!operation.success) return res.status(500).json(getFailedJson("task", req))

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
