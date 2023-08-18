import { SubtaskRequestBodySchemaInput, subtaskRequestBodySchema } from "@/schemas/subtask/delete"

export async function deleteSubtaskMutationFunction(
  props: SubtaskRequestBodySchemaInput,
  headers: Headers
) {
  const { id } = subtaskRequestBodySchema.parse(props)

  const response = await fetch("/api/subtask", {
    body: JSON.stringify({ id }),
    headers,
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete task")
  }

  return response
}
