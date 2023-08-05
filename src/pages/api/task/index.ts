import { NextApiRequest, NextApiResponse } from "next"

const users = {
  user_2TVlSS3DhS6ia4gx0jIYr8DPlh3: "Realize",
  user_2TU41jIExKgUDaqRRPbuIa6TJrm: "Vitor Markis2369",
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const headers = req.headers
    const [bearer, userId] = headers.authorization?.split(" ") ?? []
    if (bearer.toLowerCase() !== "bearer") {
      return res.status(401).json({
        message: "Invalid authentication.",
      })
    }
    const body = JSON.parse(req.body)
    const author = users[userId as keyof typeof users] ?? "Desconhecido"

    return res.status(200).json({
      body,
      author,
    })
  }
}
