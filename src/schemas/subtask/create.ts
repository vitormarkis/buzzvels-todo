import { z } from "zod"

export const subtaskSchemaAPI = z
  .object({
    createdAt: z.number(),
    id: z.string(),
    isDone: z.boolean().default(false),
    task: z.string().min(1),
    taskId: z.string(),
  })
  .strict()

export type SubtaskApiBodySchemaInput = z.input<typeof subtaskSchemaAPI>
export type SubtaskApiBodySchema = z.output<typeof subtaskSchemaAPI>
