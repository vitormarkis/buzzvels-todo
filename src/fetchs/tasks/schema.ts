import { z } from "zod"

export const taskSchemaAPI = z
  .object({
    id: z.string(),
    endDate: z.number().nullable(),
    createdAt: z.number(),
    task: z.string().min(1),
    isDone: z.boolean().default(false),
  })
  .strict()

export const subtaskSchema = z
  .object({
    id: z.string(),
    createdAt: z.number(),
    task: z.string().min(1),
    isDone: z.boolean().default(false),
    taskId: z.string(),
  })
  .strict()

export type TaskAPI = z.output<typeof taskSchemaAPI>
export type SubtaskSession = z.output<typeof subtaskSchema>
export type TaskSession = TaskAPI & {
  subtasks: SubtaskSession[]
}
