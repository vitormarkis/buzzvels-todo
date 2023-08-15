import { MutateToggleSubtask } from "@/components/molecules/to-do/ToDo"

export async function toggleSubtaskMutationFunction(
  { isDone, subtask }: MutateToggleSubtask,
  headers: Headers
) {
  const response = await fetch(`/api/subtask/${subtask.id}/toggle`, {
    body: JSON.stringify({
      isDone,
    }),
    method: "PATCH",
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to toggle sub-task")
  }

  return response
}
