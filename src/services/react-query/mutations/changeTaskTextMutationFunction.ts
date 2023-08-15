import { MutateChangeTaskTextInput } from "@/schemas/task/change"

export async function changeTaskTextMutationFunction(
  { taskId, text }: MutateChangeTaskTextInput,
  headers: Headers
) {
  const response = await fetch(`/api/task/${taskId}`, {
    body: JSON.stringify({
      text,
    }),
    method: "PATCH",
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to change task text")
  }

  return response
}
