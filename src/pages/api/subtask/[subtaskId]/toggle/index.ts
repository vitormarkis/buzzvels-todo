import { redis } from "@/lib/redis"
import { NextApiRequest, NextApiResponse } from "next"
import { nanoid } from "nanoid"
import {
  SubtaskApiBodySchemaInput,
  mutateCreateNewSubtaskSchema,
  subtaskApiBodySchema,
} from "@/schemas/subtask/create"
import { mutateDeleteSubtaskSchema, subtaskRequestBodySchema } from "@/schemas/subtask/delete"
import { getAuth } from "@/utils/getAuth"
import {
  MutateChangeSubtaskTextInput,
  mutateChangeSubtaskTextSchema,
} from "@/schemas/subtask/change"
import { wasOperationSuccess } from "@/utils/wasOperationSuccess"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    try {
      const [{ responseNotAuth, json }] = getAuth(req, res)
      if (responseNotAuth) return responseNotAuth.json(json)

      const query = req.query as { subtaskId: string }
      const { isDone } = JSON.parse(req.body) as { isDone: boolean }

      const successResponse = await redis.hset(query.subtaskId, { isDone })

      if (successResponse !== 0) {
        throw new Error("Failed to toggle subtask.")
      }

      return res.status(200).json({
        message: "Toggle subtask successfully.",
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to toggle subtask.",
        error,
      })
    }
  }
}
