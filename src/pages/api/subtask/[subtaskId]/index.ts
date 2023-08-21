import { NextApiRequest, NextApiResponse } from "next"

import { redis } from "@/lib/redis"

import {
  MutateChangeSubtaskTextInput,
  mutateChangeSubtaskTextSchema,
} from "@/schemas/subtask/change"
import { getAuth } from "@/utils/getAuth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

      const { userId } = auth
      const { subtaskId } = req.query as { subtaskId: string }

      const operationResponses = await Promise.all([
        redis.del(subtaskId),
        redis.lrem(`subtasks:${userId}`, 1, subtaskId),
      ])

      const allOperationsSuccess = operationResponses.every(n => n === 0)

      if (allOperationsSuccess) {
        throw new Error("Failed to delete subtask.")
      }

      return res.status(200).json({
        message: "Delete subtask successfully.",
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to delete subtask.",
        error,
      })
    }
  }

  if (req.method === "PATCH") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

      const query = req.query as { subtaskId: string }
      const body = JSON.parse(req.body)

      const { subtaskId, text } = mutateChangeSubtaskTextSchema.parse({
        subtaskId: query.subtaskId,
        text: body.text,
      } satisfies MutateChangeSubtaskTextInput)

      const successResponse = await redis.hset(subtaskId, { task: text })

      if (successResponse !== 0) {
        throw new Error("Failed to change the subtask text.")
      }

      return res.status(200).json({
        message: "Change subtask text successfully.",
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to change the subtask text.",
        error,
      })
    }
  }
}
