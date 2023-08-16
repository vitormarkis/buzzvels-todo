import { CenteredContainer } from "@/components/container/centered-container/CenteredContainer"
import { PadWrapper } from "@/components/container/pad-container/PadWrapper"
import { IconPlus } from "@/components/icons"
import { IconWrite } from "@/components/icons/IconWrite"
import { ModalCreateNewTask } from "@/components/modal"
import { SortingBar } from "@/components/molecules/sorting-bar/SortingBar"
import { TasksList } from "@/components/molecules/tasks-list/TasksList"
import { Header, Sidebar } from "@/components/organisms"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { useTasks } from "@/factories/createTasks"
import { SubtaskSession, TaskSession, subtaskSchema, taskSchemaAPI } from "@/fetchs/tasks/schema"
import { CreateNewTaskForm } from "@/form/create-new-task/schema"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { useTasksListState } from "@/hooks/useTasksListState"
import { redis } from "@/lib/redis"
import { cn } from "@/lib/utils"
import { ClerkBuilder } from "@/types/clerkBuilder"
import { useAuth } from "@clerk/nextjs"
import { User, buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { z } from "zod"
import st from "./page.module.css"

type ServerSideProps = {
  user?: User | null | undefined
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ctx => {
  const { userId } = getAuth(ctx.req)

  const rawUser = userId ? await clerkClient.users.getUser(userId) : undefined
  const clerk = buildClerkProps(ctx.req, { user: rawUser }) as unknown as ClerkBuilder
  const user = clerk?.__clerk_ssr_state?.user ?? null

  return { props: { user } }
}

export default function Home({ user }: ServerSideProps) {
  const [floatingNewTaskVisible, setFloatingNewTaskVisible] = useState(false)
  const [isLoadingNewTask, setIsLoadingNewTask] = useState(false)

  const { userId } = useAuth()
  const { headers } = useUserInfo()
  const queryClient = useQueryClient()
  const tasksCache: TaskSession[] | undefined = queryClient.getQueryData(["tasksIds", userId])
  const [isMounted, setIsMounted] = useState(false)
  const { toast } = useToast()
  const { sortCurrent } = useTasksListState()

  const { data: tasksResponse } = useQuery<TaskSession[]>({
    queryKey: ["tasksIds", userId],
    queryFn: async () => {
      const [tasksIds, subtasksIds] = await Promise.all([
        redis.lrange(`tasks:${userId}`, 0, -1),
        redis.lrange(`subtasks:${userId}`, 0, -1),
      ])

      const [unparsedTasks, unparsedSubtasks] = await Promise.all([
        Promise.all(tasksIds.map(taskId => redis.hgetall(taskId))),
        Promise.all(subtasksIds.map(subtaskId => redis.hgetall(subtaskId))),
      ])

      const [tasks, subtasks] = await Promise.all([
        z.array(taskSchemaAPI).parseAsync(unparsedTasks),
        z.array(subtaskSchema).parseAsync(unparsedSubtasks),
      ])

      const subtasksEntries = subtasks.reduce(
        (newTasksAcc, subtask) => {
          const alreadyHasObjectWithTaskId = newTasksAcc.find(i => i.id === subtask.taskId)

          if (alreadyHasObjectWithTaskId) {
            newTasksAcc = newTasksAcc.map(taskWithSubtasks =>
              taskWithSubtasks.id === subtask.taskId
                ? {
                    ...taskWithSubtasks,
                    subtasks: [...taskWithSubtasks.subtasks, subtask],
                  }
                : taskWithSubtasks
            )
          } else {
            newTasksAcc = [
              ...newTasksAcc,
              {
                id: subtask.taskId,
                subtasks: [subtask],
              },
            ]
          }

          return newTasksAcc
        },
        [] as Array<{
          id: string
          subtasks: SubtaskSession[]
        }>
      )

      const tasksWithSubtasks = tasks.map(task => {
        const { subtasks = [] } = subtasksEntries.find(stEntry => stEntry.id === task.id) ?? {}
        return {
          ...task,
          subtasks,
        }
      })

      return tasksWithSubtasks as TaskSession[]
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to retrieve tasks",
        description: (
          <>
            Something went wrong on our server during the fetch of your tasks,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
  })
  const { tasks } = useTasks(tasksResponse, {
    sortCurrent,
  })

  const { mutate: createNewTodoMutate } = useMutation<{}, {}, CreateNewTaskForm>({
    mutationFn: async ({ task, endDate, hasDeadlineDate }) => {
      setIsLoadingNewTask(true)

      const response = await fetch("/api/task", {
        body: JSON.stringify({
          task,
          endDate,
          hasDeadlineDate,
        }),
        method: "POST",
        headers,
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      return response
    },
    onError: () => {
      setIsLoadingNewTask(false)

      toast({
        variant: "destructive",
        title: "Failed to create task",
        description: (
          <>
            Something went wrong on our server during the creation of your task,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasksIds", userId])
    },
    retry: 3,
  })

  useEffect(() => {
    if (isLoadingNewTask) setIsLoadingNewTask(false)
  }, [tasksCache])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useScrollPosition(setFloatingNewTaskVisible, {
    range: [120, Infinity],
  })

  return (
    <>
      <Header user={user} />
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
        <main className="flex-1 pt-12 pb-24 space-y-6 px-0 sm:px-6 overflow-x-hidden">
          <ModalCreateNewTask mutate={createNewTodoMutate}>
            <Button
              size="xl"
              className="__neutral mx-auto"
            >
              <IconPlus size={16} />
              <span>New task</span>
            </Button>
          </ModalCreateNewTask>
          <PadWrapper className="__two">
            <SortingBar />
            <TasksList
              tasks={tasks ?? null}
              className="__two"
              isLoadingNewTask={isLoadingNewTask}
            />
          </PadWrapper>
        </main>
      </CenteredContainer>
    </>
  )
}
