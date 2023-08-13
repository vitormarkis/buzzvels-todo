import { taskSchemaAPI } from "@/fetchs/tasks/schema"
import { subtaskRequestBodySchema } from "@/schemas/subtask/delete"
import { z } from "zod"

export const mutateChangeSubtaskTextSchema = z.object({
  text: taskSchemaAPI.shape.task,
  subtaskId: subtaskRequestBodySchema.shape.id,
})

export type MutateChangeSubtaskTextInput = z.input<typeof mutateChangeSubtaskTextSchema>
export type MutateChangeSubtaskText = z.output<typeof mutateChangeSubtaskTextSchema>
