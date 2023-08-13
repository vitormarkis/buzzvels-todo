import { z } from "zod"

export const subtaskApiBodySchema = z
  .object({
    createdAt: z.number(),
    id: z.string(),
    isDone: z.boolean().default(false),
    task: z.string().min(1),
    taskId: z.string(),
  })
  .strict()

export type SubtaskApiBodySchemaInput = z.input<typeof subtaskApiBodySchema>
export type SubtaskApiBodySchema = z.output<typeof subtaskApiBodySchema>

export const mutateCreateNewSubtaskSchema = subtaskApiBodySchema
  .pick({
    isDone: true,
    taskId: true,
    task: true,
  })
  .strict()

export type MutateCreateNewSubtaskInput = z.input<typeof mutateCreateNewSubtaskSchema>
export type MutateCreateNewSubtask = z.output<typeof mutateCreateNewSubtaskSchema>
