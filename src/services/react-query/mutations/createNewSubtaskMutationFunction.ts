import { z } from "zod"
import { subtaskSchemaAPI } from "@/schemas/subtask/create"

export const mutateCreateNewSubtaskSchema = subtaskSchemaAPI
  .pick({
    isDone: true,
    task: true,
    taskId: true,
  })
  .strict()

export type MutateCreateNewSubtaskInput = z.input<typeof mutateCreateNewSubtaskSchema>
export type MutateCreateNewSubtask = z.output<typeof mutateCreateNewSubtaskSchema>

export async function createNewSubtaskMutationFunction(
  props: MutateCreateNewSubtaskInput,
  headers: Headers
) {
  const { isDone, task, taskId } = props

  const response = await fetch("/api/subtask", {
    body: JSON.stringify({ isDone, task, taskId }),
    headers,
    method: "POST",
  })

  if (!response.ok) {
    throw new Error("Failed to create task")
  }

  const data = await response.json()
  return data
}
