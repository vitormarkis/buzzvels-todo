import { NextApiRequest, NextApiResponse } from "next"

import { redis } from "@/lib/redis"

import {
  MutateChangeSubtaskTextInput,
  mutateChangeSubtaskTextSchema,
} from "@/schemas/subtask/change"
import { getAuth } from "@/utils/getAuth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
