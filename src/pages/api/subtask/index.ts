import { nanoid } from "nanoid"
import { NextApiRequest, NextApiResponse } from "next"

import { redis } from "@/lib/redis"

import { SubtaskAPI } from "@/fetchs/tasks/schema"
import { subtaskRequestBodySchema } from "@/schemas/subtask/delete"
import { mutateCreateNewSubtaskSchema } from "@/services/react-query/mutations"
import { bodyParser } from "@/utils/bodyParser"
import { getAuth } from "@/utils/getAuth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const auth = getAuth(req)
    if (!auth.isAuth) return res.status(401).json(auth.responseJson)
    const { userId } = auth

    const bodyParsed = bodyParser(req, mutateCreateNewSubtaskSchema)
    if (!bodyParsed.parse.success) return res.status(400).json(bodyParsed.json)

    const { isDone, task, taskId } = bodyParsed.parse.data
    const subtaskId = `subtask_${nanoid()}`

    const subtask: SubtaskAPI = {
      createdAt: new Date().getTime(),
      id: subtaskId,
      isDone,
      task,
      taskId,
    }

    await Promise.all([
      redis.rpush(`subtasks:${userId}`, subtaskId),
      redis.hset(subtaskId, subtask),
    ])

    return res.status(201).json(subtask)
  }
  if (req.method === "DELETE") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)
      const { userId } = auth
      const bodyParsed = bodyParser(req, subtaskRequestBodySchema)
      if (!bodyParsed.parse.success) return res.status(400).json(bodyParsed.json)

      const { subtaskId } = bodyParsed.parse.data

      await Promise.all([redis.del(subtaskId), redis.lrem(`subtasks:${userId}`, 1, subtaskId)])

      return res.status(200).json({
        message: "Subtask deleted with success!",
      })
    } catch (error) {
      return res.status(500).json(error)
    }
  }
}
