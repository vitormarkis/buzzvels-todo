import { z } from "zod"

export const taskSchema = z
  .object({
    id: z.string(),
    endDate: z.number().nullable(),
    createdAt: z.number(),
    task: z.string().min(1),
    isDone: z.boolean().default(false),
  })
  .strict()

export type TaskSession = z.output<typeof taskSchema>
