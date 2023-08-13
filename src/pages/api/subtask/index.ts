import { redis } from "@/lib/redis"
import { NextApiRequest, NextApiResponse } from "next"
import { nanoid } from "nanoid"
import {
  SubtaskApiBodySchemaInput,
  mutateCreateNewSubtaskSchema,
  subtaskApiBodySchema,
} from "@/schemas/subtask/create"
import { mutateDeleteSubtaskSchema, subtaskRequestBodySchema } from "@/schemas/subtask/delete"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const headers = req.headers
    const [bearer, userId] = headers.authorization?.split(" ") ?? []
    if (bearer.toLowerCase() !== "bearer") {
      return res.status(401).json({
        message: "Invalid authentication.",
      })
    }

    const { isDone, task, taskId } = mutateCreateNewSubtaskSchema.parse(JSON.parse(req.body))

    const subtaskId = `subtask_${nanoid()}`

    const subtask = subtaskApiBodySchema.parse({
      createdAt: new Date().getTime(),
      id: subtaskId,
      isDone,
      task,
      taskId,
    } satisfies SubtaskApiBodySchemaInput)

    await Promise.all([
      redis.rpush(`subtasks:${userId}`, subtaskId),
      redis.hset(subtaskId, subtask),
    ])

    return res.status(201).json(subtask)
  }
  if (req.method === "DELETE") {
    const headers = req.headers
    const [bearer, userId] = headers.authorization?.split(" ") ?? []
    if (bearer.toLowerCase() !== "bearer") {
      return res.status(401).json({
        message: "Invalid authentication.",
      })
    }

    try {
      const { id: subtaskId } = subtaskRequestBodySchema.parse(JSON.parse(req.body))

      await Promise.all([redis.del(subtaskId), redis.lrem(`subtasks:${userId}`, 1, subtaskId)])

      return res.status(201).json({})
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}
