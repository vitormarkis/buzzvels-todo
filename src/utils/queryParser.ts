import { NextApiRequest } from "next"
import { z } from "zod"

export type ExtractDataType<TSchema extends z.ZodType<any>> = z.output<TSchema>

type ResponseJSON = {
  message: string
  error: z.ZodError | {}
}

export function queryParser<T extends z.ZodType<any>>(
  req: NextApiRequest,
  queryParserSchema: T
): {
  parse: z.SafeParseReturnType<ExtractDataType<T>, ExtractDataType<T>>
  json: ResponseJSON
} {
  const data = queryParserSchema.safeParse(req.query)
  const json = {
    message: "Bad input.",
    error: data.success ? {} : data.error,
  }

  return {
    parse: data as z.SafeParseReturnType<ExtractDataType<T>, any>,
    json,
  }
}
