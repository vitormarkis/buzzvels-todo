import { SubtaskRequestBodySchemaInput } from "@/schemas/subtask/delete"

export async function deleteSubtaskMutationFunction(
  { subtaskId }: SubtaskRequestBodySchemaInput,
  headers: Headers
) {
  const response = await fetch(`/api/subtask/${subtaskId}`, {
    method: "DELETE",
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to delete subtask")
  }

  const data = await response.json()
  return data
}
