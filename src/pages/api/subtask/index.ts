import { nanoid } from "nanoid"
import { NextApiRequest, NextApiResponse } from "next"

import { redis } from "@/lib/redis"

import { SubtaskApiBodySchemaInput, subtaskSchema } from "@/schemas/subtask/create"
import { subtaskRequestBodySchema } from "@/schemas/subtask/delete"
import { mutateCreateNewSubtaskSchema } from "@/services/react-query/mutations"
import { getAuth } from "@/utils/getAuth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const auth = getAuth(req)
    if (!auth.isAuth) return res.status(401).json(auth.responseJson)
    const { userId } = auth

    const { isDone, task, taskId } = mutateCreateNewSubtaskSchema.parse(JSON.parse(req.body))

    const subtaskId = `subtask_${nanoid()}`

    const subtask = subtaskSchema.parse({
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
    const auth = getAuth(req)
    if (!auth.isAuth) return res.status(401).json(auth.responseJson)
    const { userId } = auth

    try {
      const { subtaskId } = subtaskRequestBodySchema.parse(JSON.parse(req.body))

      await Promise.all([redis.del(subtaskId), redis.lrem(`subtasks:${userId}`, 1, subtaskId)])

      return res.status(201).json({})
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}
