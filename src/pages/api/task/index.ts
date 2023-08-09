import { redis } from "@/lib/redis"
import { NextApiRequest, NextApiResponse } from "next"
import { nanoid } from "nanoid"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const headers = req.headers
    const [bearer, userId] = headers.authorization?.split(" ") ?? []
    if (bearer.toLowerCase() !== "bearer") {
      return res.status(401).json({
        message: "Invalid authentication.",
      })
    }

    const taskBody = JSON.parse(req.body)

    const taskId = `task_${nanoid()}`

    const task = {
      ...taskBody,
      createdAt: new Date().getTime(),
      id: taskId,
    }

    await redis.rpush(`tasks:${userId}`, taskId)
    await redis.hset(taskId, task)

    return res.status(201).json(task)
  }
}
