import { TaskSession } from "@/fetchs/tasks/schema"

export async function getTasks<T = TaskSession>(headers: Headers): Promise<T[]> {
  const response = await fetch("/api/task", {
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to retrieve your tasks")
  }

  const data = await response.json()
  return data as T[]
}
