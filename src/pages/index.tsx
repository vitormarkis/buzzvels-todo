import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { useAuth } from "@clerk/nextjs"
import { User, buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server"
import { Query, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { cn } from "@/lib/utils"

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

import { createQueryCache } from "@/factories/createQueryCache"
import { useTasks } from "@/factories/createTasks"
import { useScrollPosition } from "@/hooks/useScrollPosition"
import { useTasksListState } from "@/hooks/useTasksListState"

import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { getTasks } from "@/fetchs/tasks/get"
import { TaskSession } from "@/fetchs/tasks/schema"
import { CreateNewTaskForm } from "@/form/create-new-task/schema"
import { createNewTodoMutationFunction } from "@/services/react-query/mutations"
import { ClerkBuilder } from "@/types/clerkBuilder"

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
  const QueryCache = createQueryCache(queryClient, userId)

  const { data: tasksResponse } = useQuery<TaskSession[]>({
    queryKey: ["tasksIds", userId],
    queryFn: () => getTasks(headers),
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
    enabled: !!userId,
    retry: 3,
  })
  const { tasks } = useTasks(tasksResponse, {
    sortCurrent,
  })

  const { mutate: createNewTodoMutate } = useMutation<
    TaskSession,
    any,
    CreateNewTaskForm & { taskId: string }
  >({
    mutationFn: ({ taskId, ...props }) => createNewTodoMutationFunction(props, headers),
    onError: () => {
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
    onMutate: ({ endDate, task, taskId }) => {
      QueryCache.tasks.add({
        endDate,
        task,
        id: taskId,
      })
    },
    onSuccess: ({ createdAt, id }, { taskId }) => {
      QueryCache.tasks.patch(taskId, currentTask => ({
        ...currentTask,
        createdAt,
        id,
      }))
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
      <CenteredContainer className="flex min-h-[calc(100dvh_-_65px)] p-0 xs:px-4">
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
              className="__neutral mx-auto">
              <IconPlus size={16} />
              <span>New task</span>
            </Button>
          </ModalCreateNewTask>
          <PadWrapper className="__two py-1 xs:p-1 gap-1">
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
