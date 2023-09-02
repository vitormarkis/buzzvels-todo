import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"
import { redis } from "@/lib/redis"
import { bodyParser } from "@/utils/bodyParser"
import { getAuth } from "@/utils/getAuth"
import { getFailedJson } from "@/utils/getFailedJson"
import { performOperation } from "@/utils/performTransaction"
import { queryParser } from "@/utils/queryParser"

const querySchema = z.object({ subtaskId: z.string() })
const bodySchema = z.object({ isDone: z.boolean() })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

      const queryParsed = queryParser(req, querySchema)
      if (!queryParsed.parse.success) return res.status(400).json(queryParsed.json)

      const bodyParsed = bodyParser(req, bodySchema)
      if (!bodyParsed.parse.success) return res.status(400).json(bodyParsed.json)

      const { subtaskId } = queryParsed.parse.data
      const { isDone } = bodyParsed.parse.data

      const transaction = redis.hset(subtaskId, { isDone })

      const operation = await performOperation(() => transaction)
      if (!operation.success) return res.status(500).json(getFailedJson("subtask", req))

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
