import { CreateNewTaskForm, createNewTaskFormSchema } from "@/form/create-new-task/schema"

export async function createNewTodoMutationFunction(props: CreateNewTaskForm, headers: Headers) {
  const { endDate, task } = createNewTaskFormSchema.parse(props)

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

  return response
}
