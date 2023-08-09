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
import { ToDo, ToDoSkeleton } from "@/components/molecules/to-do/ToDo"
import { CreateNewTaskForm, createNewTaskFormSchema } from "@/form/create-new-task/schema"
import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { useEffect, useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"
import { IconWrite } from "@/components/icons/IconWrite"

export default function Home() {
  const [floatingNewTaskVisible, setFloatingNewTaskVisible] = useState(false)
  const [isLoadingNewTask, setIsLoadingNewTask] = useState(false)
  const { userId } = useAuth()
  const { headers } = useUserInfo()
  const queryClient = useQueryClient()
  const tasksCache = queryClient.getQueryData(["tasksIds", userId])
  const [isMounted, setIsMounted] = useState(false)

  const { data: rawTasks } = useQuery({
    queryKey: ["tasksIds", userId],
    queryFn: async () => {
      const tasksIds = await redis.lrange(`tasks:${userId}`, 0, 9 ** 9)
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

  const { mutate: createNewTodoMutate } = useMutation<{}, {}, CreateNewTaskForm>({
    mutationFn: ({ task, endDate, hasDeadlineDate }) => {
      setIsLoadingNewTask(true)

      return fetch("/api/task", {
        body: JSON.stringify({
          task,
          endDate,
          hasDeadlineDate,
        }),
        method: "POST",
        headers,
      })
    },
    onError: error => console.log("onError", error),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasksIds", userId])
    },
  })

  const tasks = rawTasks?.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  useEffect(() => {
    if (isLoadingNewTask) setIsLoadingNewTask(false)
  }, [tasksCache])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 120) {
        setFloatingNewTaskVisible(true)
      } else {
        setFloatingNewTaskVisible(false)
      }
    }

    window.addEventListener("scroll", scrollListener)

    return () => window.removeEventListener("scroll", scrollListener)
  }, [])

  return (
    <>
      <Header />
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[1px] h-[1px] bg-gradient-to-r from-transparent to-transparent via-color/40 max-w-xl w-full" />
      <div className={cn(st.sponge, "dark:visible invisible")} />
      <CenteredContainer className="flex min-h-[calc(100dvh_-_65px)]">
        {isMounted && floatingNewTaskVisible
          ? createPortal(
              <div className="absolute bottom-12 right-12 pointer-events-auto">
                <ModalCreateNewTask mutate={createNewTodoMutate}>
                  <Button className="__neutral">
                    <IconWrite />
                    <span>New task</span>
                  </Button>
                </ModalCreateNewTask>
              </div>,
              document.querySelector("#portal")!
            )
          : null}
        <aside className="hidden md:flex max-h-screen w-[200px] border-r sticky top-[65px] h-[calc(100dvh_-_65px)]">
          <Sidebar />
        </aside>
        <main className="flex-1 pt-12 pb-24 space-y-6 px-0 sm:px-6">
          <ModalCreateNewTask mutate={createNewTodoMutate}>
            <Button
              size="xl"
              className="__neutral mx-auto"
            >
              <IconPlus size={16} />
              New task
            </Button>
          </ModalCreateNewTask>
          <PadWrapper className="__two">
            {isLoadingNewTask && <ToDoSkeleton />}
            {/* {true && <ToDoSkeleton />} */}
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
