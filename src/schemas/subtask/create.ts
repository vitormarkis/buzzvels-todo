import { z } from "zod"

export const subtaskSchema = z
  .object({
    createdAt: z.number(),
    id: z.string(),
    isDone: z.boolean().default(false),
    task: z.string().min(1),
    taskId: z.string(),
  })
  .strict()

export type SubtaskApiBodySchemaInput = z.input<typeof subtaskSchema>
export type SubtaskApiBodySchema = z.output<typeof subtaskSchema>
