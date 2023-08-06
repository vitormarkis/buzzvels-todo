import { getTasks } from "@/fetchs/tasks/get"
import { taskSchema } from "@/fetchs/tasks/schema"
import { z } from "zod"

export async function queryTasks(userId: string | null | undefined) {
  if (!userId) return null
  const unknownDataFormat = await getTasks(userId)
  const data = z.array(taskSchema).parse(unknownDataFormat)
  return data as Array<z.output<typeof taskSchema>>
}
