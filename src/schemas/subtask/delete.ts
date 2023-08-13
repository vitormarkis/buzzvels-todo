import { subtaskApiBodySchema } from "@/schemas/subtask/create"
import { z } from "zod"

export const subtaskRequestBodySchema = subtaskApiBodySchema
  .pick({
    id: true,
  })
  .strict()

export type SubtaskRequestBodySchemaInput = z.input<typeof subtaskRequestBodySchema>
export type SubtaskRequestBodySchema = z.output<typeof subtaskRequestBodySchema>

export const mutateDeleteSubtaskSchema = subtaskApiBodySchema
  .pick({
    taskId: true,
    id: true,
  })
  .strict()

export type MutateDeleteSubtaskInput = z.input<typeof mutateDeleteSubtaskSchema>
export type MutateDeleteSubtask = z.output<typeof mutateDeleteSubtaskSchema>
