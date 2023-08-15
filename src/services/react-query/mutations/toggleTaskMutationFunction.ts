import { MutateToggleTask } from "@/components/molecules/to-do/ToDo"

export async function toggleTaskMutationFunction(
  { isDone, taskId }: MutateToggleTask,
  headers: Headers
) {
  const response = await fetch(`/api/subtask/${taskId}/toggle`, {
    body: JSON.stringify({
      isDone,
    }),
    method: "PATCH",
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to toggle task")
  }

  return response
}
