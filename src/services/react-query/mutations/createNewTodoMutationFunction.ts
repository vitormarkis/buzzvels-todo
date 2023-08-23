import { CreateNewTaskForm } from "@/form/create-new-task/schema"

export async function createNewTodoMutationFunction(
  { endDate, task }: CreateNewTaskForm,
  headers: Headers
) {
  const response = await fetch("/api/task", {
    body: JSON.stringify({
      endDate,
      task,
    }),
    method: "POST",
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to create task")
  }

  const data = await response.json()
  return data
}
