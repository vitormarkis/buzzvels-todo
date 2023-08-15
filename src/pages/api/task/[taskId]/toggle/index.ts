import { redis } from "@/lib/redis"
import { getAuth } from "@/utils/getAuth"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    try {
      const [{ responseNotAuth, json }] = getAuth(req, res)
      if (responseNotAuth) return responseNotAuth.json(json)

      const { taskId } = req.query as { taskId: string }
      const { isDone } = JSON.parse(req.body) as { isDone: boolean }

      const successResponse = await redis.hset(taskId, { isDone })

      if (successResponse !== 0) {
        throw new Error("Failed to toggle task.")
      }

      return res.status(200).json({
        message: "Toggled task successfully.",
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to toggle task.",
        error,
      })
    }
  }
}
