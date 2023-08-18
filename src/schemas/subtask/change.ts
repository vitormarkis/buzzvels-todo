import { z } from "zod"

import { taskSchemaAPI } from "@/fetchs/tasks/schema"
import { subtaskRequestBodySchema } from "@/schemas/subtask/delete"

export const mutateChangeSubtaskTextSchema = z.object({
  text: taskSchemaAPI.shape.task,
  subtaskId: subtaskRequestBodySchema.shape.id,
})

export type MutateChangeSubtaskTextInput = z.input<typeof mutateChangeSubtaskTextSchema>
export type MutateChangeSubtaskText = z.output<typeof mutateChangeSubtaskTextSchema>
