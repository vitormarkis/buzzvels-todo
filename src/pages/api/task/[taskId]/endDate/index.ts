import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

import { redis } from "@/lib/redis"

import { bodyParser } from "@/utils/bodyParser"
import { getAuth } from "@/utils/getAuth"
import { getFailedJson } from "@/utils/getFailedJson"
import { performOperation } from "@/utils/performTransaction"
import { queryParser } from "@/utils/queryParser"

const querySchema = z.object({ taskId: z.string() })

const bodySchema = z
  .object({
    endDate: z
      .any()
      .refine(
        v => {
          if (v === null) return true
          const d = new Date(v)
          return d instanceof Date && isFinite(d.getTime())
        },
        { message: "invalid possible date" }
      )
      .transform(v => (v === null ? v : new Date(v).getTime())),
    // endDate: z.any(),
  })
  .strict()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    try {
      const auth = getAuth(req)
      if (!auth.isAuth) return res.status(401).json(auth.responseJson)

      const queryParsed = queryParser(req, querySchema)
      if (!queryParsed.parse.success) return res.status(400).json(queryParsed.json)

      const bodyParsed = bodyParser(req, bodySchema)
      if (!bodyParsed.parse.success) return res.status(400).json(bodyParsed.json)

      const { taskId } = queryParsed.parse.data
      const { endDate } = bodyParsed.parse.data

      const transaction = redis.hset(taskId, { endDate })

      const operation = await performOperation(() => transaction)
      if (!operation.success) return res.status(500).json(getFailedJson("task", req))

      return res.status(200).json({
        message: endDate
          ? "Added end date from task with success!"
          : "Removed end date from task with success!",
        endDate,
      })
    } catch (error) {
      return res.status(400).json({
        message: "Failed to toggle task.",
        error,
      })
    }
  }
}
