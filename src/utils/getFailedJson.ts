import { NextApiRequest } from "next"

export const getFailedJson = (name: string, req: NextApiRequest) => ({
  message: `Operation failed [${req.method}]:${name}, something wrong on database!`,
})
