import { NextApiRequest } from "next"
import { z } from "zod"

export type ExtractDataType<TSchema extends z.ZodType<any>> = z.output<TSchema>

type ResponseJSON = {
  message: string
  error: z.ZodError | {}
}

export function bodyParser<T extends z.ZodType<any>>(
  req: NextApiRequest,
  bodyParserSchema: T
): {
  parse: z.SafeParseReturnType<ExtractDataType<T>, ExtractDataType<T>>
  json: ResponseJSON
} {
  const data = bodyParserSchema.safeParse(JSON.parse(req.body))
  const json = {
    message: "Bad input.",
    error: data.success ? {} : data.error,
  }

  return {
    parse: data as z.SafeParseReturnType<ExtractDataType<T>, any>,
    json,
  }
}
