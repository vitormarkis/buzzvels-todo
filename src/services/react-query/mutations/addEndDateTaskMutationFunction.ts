import { MutateAddEndDateTask } from "@/schemas/task/add-end-date"

export async function addEndDateTaskMutationFunction(
  { endDate, taskId }: MutateAddEndDateTask["payload"],
  headers: Headers
) {
  const response = await fetch(`/api/task/${taskId}/endDate`, {
    body: JSON.stringify({
      endDate,
    }),
    method: "PATCH",
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to add end date to this task.")
  }

  const data = await response.json()
  return data
}
