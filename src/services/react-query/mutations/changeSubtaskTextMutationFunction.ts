import { MutateChangeSubtaskTextInput } from "@/schemas/subtask/change"

export async function changeSubtaskTextMutationFunction(
  { subtaskId, text }: MutateChangeSubtaskTextInput,
  headers: Headers
) {
  const response = await fetch(`/api/subtask/${subtaskId}`, {
    body: JSON.stringify({
      text,
    }),
    method: "PATCH",
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to change sub-task text")
  }

  const data = await response.json()
  return data
}
