import { MutateDeleteTask } from "@/components/molecules/to-do/ToDo"

export async function deleteTaskMutationFunction({ taskId }: MutateDeleteTask, headers: Headers) {
  const response = await fetch(`/api/task/${taskId}`, {
    method: "DELETE",
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to delete task")
  }

  const data = await response.json()
  return data
}
