import { getTasks } from "@/fetchs/tasks/get"
import { taskSchemaAPI } from "@/fetchs/tasks/schema"
import { z } from "zod"

export async function queryTasks(userId: string | null | undefined) {
  if (!userId) return null
  const unknownDataFormat = await getTasks(userId)
  const data = z.array(taskSchemaAPI).parse(unknownDataFormat)
  return data as Array<z.output<typeof taskSchemaAPI>>
}
