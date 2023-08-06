import { z } from "zod"

export const taskSchema = z.object({
  endDate: z.number().nullable(),
  createdAt: z.number(),
  task: z.string().min(1),
})

export type TaskSession = z.output<typeof taskSchema>
