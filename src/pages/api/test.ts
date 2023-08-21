import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const headers = req.headers
    const [bearer, userId] = headers.authorization?.split(" ") ?? []
    if (bearer.toLowerCase() !== "bearer") {
      return res.status(401).json({
        message: "Invalid authorization token.",
      })
    }

    const { name } = JSON.parse(req.body)

    return res.status(200).json({
      userId,
      name: `Your name is ${name}`,
    })
  }
}
