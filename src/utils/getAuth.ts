import { NextApiRequest } from "next"

export type AuthResponse =
  | {
      isAuth: false
      responseJson: {
        message: string
      }
    }
  | {
      isAuth: true
      responseJson: {}
      userId: string
    }

export function getAuth(req: NextApiRequest): AuthResponse {
  const headers = req.headers
  const [bearer, userId] = headers?.authorization?.split(" ") ?? []
  const isTokenInvalid = [
    !bearer,
    !userId,
    bearer?.toLowerCase() !== "bearer",
    userId?.length === 0,
  ].some(Boolean)

  if (isTokenInvalid) {
    const responseJson = { message: "Invalid authorization token" }

    return {
      isAuth: false,
      responseJson,
    }
  }

  return {
    isAuth: true,
    responseJson: {},
    userId,
  }
}
