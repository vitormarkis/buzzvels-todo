import { NextApiRequest, NextApiResponse } from "next"

import { redis } from "@/lib/redis"

import { getAuth } from "@/utils/getAuth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

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
