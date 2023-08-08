import { Button } from "@/components/ui/button"
import st from "./page.module.css"
import { cn } from "@/lib/utils"
import { CenteredContainer } from "@/components/container/centered-container/CenteredContainer"
import { Header, Sidebar } from "@/components/organisms"
import { IconPlus } from "@/components/icons"
import { ModalCreateNewTask } from "@/components/modal"
import { redis } from "@/lib/redis"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@clerk/nextjs"
import { TaskSession, taskSchema } from "@/fetchs/tasks/schema"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { PadWrapper } from "@/components/container/pad-container/PadWrapper"
import { PadContainer } from "@/components/container/pad-container/PadContainer"
import { ToDo } from "@/components/molecules/to-do/ToDo"

export default function Home() {
  const { userId } = useAuth()
  const { data: tasks } = useQuery({
    queryKey: ["tasksIds", userId],
    queryFn: async () => {
      const tasksIds = await redis.lrange(`tasks:${userId}`, 0, 9)
      const unparsedTasks = await Promise.all(tasksIds.map(taskId => redis.hgetall(taskId)))
      try {
        const tasks = await z.array(taskSchema).parseAsync(unparsedTasks)
        return tasks
      } catch (error) {
        console.log({
          unparsedTasks,
          error,
        })
      }
    },
    staleTime: 60 * 1000,
  })

  return (
    <>
      <Header />
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[1px] h-[1px] bg-gradient-to-r from-transparent to-transparent via-color/40 max-w-xl w-full" />
      <div className={cn(st.sponge, "dark:visible invisible")} />
      <CenteredContainer className="flex h-[calc(100dvh_-_65px)]">
        <aside className="hidden md:flex h-full max-h-screen w-[200px] border-r">
          <Sidebar />
        </aside>
        <main className="flex-1 py-12 space-y-6 px-6">
          <ModalCreateNewTask>
            <Button
              size="xl"
              className="__neutral mx-auto"
            >
              <IconPlus size={16} />
              New task
            </Button>
          </ModalCreateNewTask>
          <PadWrapper className="__two">
            {tasks?.map(task => (
              <ToDo
                key={task.task}
                className="__first"
                task={task}
              />
            ))}
          </PadWrapper>
        </main>
      </CenteredContainer>
    </>
  )
}
