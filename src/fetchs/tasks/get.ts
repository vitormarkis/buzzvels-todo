import { TaskSession } from "@/fetchs/tasks/schema"
import { redis } from "@/lib/redis"

export async function getTasks<T = TaskSession>(userId: string | null | undefined): Promise<T[]> {
  const tasksIds = await redis.lrange(`tasks:${userId}`, 0, 9)
  const tasks = await Promise.all(tasksIds.map(taskId => redis.hgetall(taskId)))
  return tasks as T[]
}
