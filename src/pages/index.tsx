import { GetServerSideProps } from "next"
import { useEffect, useState } from "react"

import { useAuth } from "@clerk/nextjs"
import { User, buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { cn } from "@/lib/utils"

import { CenteredContainer } from "@/components/container/centered-container/CenteredContainer"
import { PadWrapper } from "@/components/container/pad-container/PadWrapper"
import { IconPlus } from "@/components/icons"
import { ModalCreateNewTask } from "@/components/modal"
import { FloatingButtonAddNewTask } from "@/components/molecules/floating-button-add-new-task/FloatingButtonAddNewTask"
import { SortingBar } from "@/components/molecules/sorting-bar/SortingBar"
import { TasksList } from "@/components/molecules/tasks-list/TasksList"
import { Header, Sidebar } from "@/components/organisms"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

import { createQueryCache } from "@/factories/createQueryCache"

import { useUserInfo } from "@/contexts/user-info/userInfoContext"
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
  const [isLoadingNewTask, setIsLoadingNewTask] = useState(false)

  const { userId } = useAuth()
  const { headers } = useUserInfo()
  const queryClient = useQueryClient()
  const tasksCache: TaskSession[] | undefined = queryClient.getQueryData(["tasksIds", userId])
  const { toast } = useToast()
  const QueryCache = createQueryCache(queryClient, userId)

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

  return (
    <>
      <Header user={user} />
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[1px] h-[1px] bg-gradient-to-r from-transparent to-transparent via-color/40 max-w-xl w-full" />
      <div className={cn(st.sponge, "dark:visible invisible")} />
      <CenteredContainer className="flex min-h-[calc(100dvh_-_65px)] p-0 xs:px-4">
        <FloatingButtonAddNewTask createNewTodoMutate={createNewTodoMutate} />
        <aside className="hidden md:flex max-h-screen w-[200px] border-r sticky top-[65px] h-[calc(100dvh_-_65px)]">
          <Sidebar />
        </aside>
        <main className="flex-1 pt-12 pb-24 px-0 sm:px-6 overflow-x-hidden">
          <ModalCreateNewTask mutate={createNewTodoMutate}>
            <Button
              size="xl"
              className="__neutral mx-auto mb-6"
            >
              <IconPlus size={16} />
              <span>New task</span>
            </Button>
          </ModalCreateNewTask>
          <PadWrapper className="__two py-1 xs:p-1 gap-1 transition">
            <SortingBar />
            <TasksList className="__two" />
          </PadWrapper>
        </main>
      </CenteredContainer>
    </>
  )
}
