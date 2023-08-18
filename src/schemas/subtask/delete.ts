import { z } from "zod"

import { subtaskSchema } from "@/schemas/subtask/create"

export const subtaskRequestBodySchema = subtaskSchema
  .pick({
    id: true,
  })
  .strict()

export type SubtaskRequestBodySchemaInput = z.input<typeof subtaskRequestBodySchema>
export type SubtaskRequestBodySchema = z.output<typeof subtaskRequestBodySchema>

export const mutateDeleteSubtaskSchema = subtaskSchema
  .pick({
    taskId: true,
    id: true,
  })
  .strict()

export type MutateDeleteSubtaskInput = z.input<typeof mutateDeleteSubtaskSchema>
export type MutateDeleteSubtask = z.output<typeof mutateDeleteSubtaskSchema>
