import { NextApiRequest, NextApiResponse } from "next"

type AuthResponse = {
  responseNotAuth: NextApiResponse | null
  json: {
    message: string
  }
}

export type AuthInfo = {
  userId: string | null
  isAuth: boolean
}

export function getAuth(
  req: NextApiRequest,
  res: NextApiResponse
): [authResponse: AuthResponse, authInfo: AuthInfo] {
  let responseNotAuth: NextApiResponse | null = null
  const headers = req.headers
  const [bearer, userId] = headers.authorization?.split(" ") ?? []
  const isAuth = bearer.toLowerCase() === "bearer"
  const json = {
    message: "Invalid authorization token.",
  }

  if (bearer.toLowerCase() !== "bearer") {
    responseNotAuth = res.status(401)
  }

  return [
    {
      responseNotAuth,
      json,
    },
    {
      isAuth,
      userId,
    },
  ]
}
