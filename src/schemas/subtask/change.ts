import { z } from "zod"

import { taskSchemaAPI } from "@/fetchs/tasks/schema"
import { subtaskSchema } from "@/schemas/subtask/create"

export const mutateChangeSubtaskTextSchema = z.object({
  text: taskSchemaAPI.shape.task,
  subtaskId: subtaskSchema.shape.id,
})

export type MutateChangeSubtaskTextInput = z.input<typeof mutateChangeSubtaskTextSchema>
export type MutateChangeSubtaskText = z.output<typeof mutateChangeSubtaskTextSchema>
