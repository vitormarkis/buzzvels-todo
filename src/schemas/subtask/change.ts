import { z } from "zod"
import { taskSchemaAPI } from "@/fetchs/tasks/schema"
import { subtaskSchemaAPI } from "@/schemas/subtask/create"

export const mutateChangeSubtaskTextSchema = z.object({
  text: taskSchemaAPI.shape.task,
  subtaskId: subtaskSchemaAPI.shape.id,
})

export type MutateChangeSubtaskTextInput = z.input<typeof mutateChangeSubtaskTextSchema>
export type MutateChangeSubtaskText = z.output<typeof mutateChangeSubtaskTextSchema>
