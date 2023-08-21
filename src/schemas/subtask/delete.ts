import { z } from "zod"

import { taskSchemaAPI } from "@/fetchs/tasks/schema"
import { subtaskSchema } from "@/schemas/subtask/create"

export const subtaskRequestBodySchema = z
  .object({
    subtaskId: subtaskSchema.shape.id,
  })
  .strict()

export type SubtaskRequestBodySchemaInput = z.input<typeof subtaskRequestBodySchema>
export type SubtaskRequestBodySchema = z.output<typeof subtaskRequestBodySchema>

export const mutateDeleteSubtaskSchema = z
  .object({
    taskId: taskSchemaAPI.shape.id,
    subtaskId: subtaskSchema.shape.id,
  })
  .strict()

export type MutateDeleteSubtaskInput = z.input<typeof mutateDeleteSubtaskSchema>
export type MutateDeleteSubtask = z.output<typeof mutateDeleteSubtaskSchema>
