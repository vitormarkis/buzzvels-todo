import { Button } from "@/components/ui/button"
import st from "./page.module.css"
import { cn } from "@/lib/utils"
import { CenteredContainer } from "@/components/container/centered-container/CenteredContainer"
import { Header, Sidebar } from "@/components/organisms"
import { IconPlus } from "@/components/icons"
import { ModalCreateNewTask } from "@/components/modal"
import { getAuth } from "@clerk/nextjs/server"
import { GetServerSideProps } from "next"
import { UserInfoProvider, useUserInfo } from "@/contexts/user-info/userInfoContext"
import { useEffect, useState } from "react"
import { redis } from "@/lib/redis"

type ServerSideProps = {
  userId: string | null
}

export default function Home({ userId }: ServerSideProps) {
  const [data, setData] = useState({})

  useEffect(() => {
    async function getData() {
      try {
        const tasksId = await redis.lrange(`tasks:${userId}`, 0, 9)
        const data = await Promise.all(
          tasksId.map(taskId => {
            const res = redis.hgetall(taskId)
            console.log({ taskContent: res })
            return res
          })
        )
        console.log({ tasksId, data })

        setData(data)
      } catch (error) {
        console.log(error)
      }
    }

    getData()
  }, [])

  return (
    <UserInfoProvider userId={userId}>
      <Header />
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[1px] h-[1px] bg-gradient-to-r from-transparent to-transparent via-color/40 max-w-xl w-full" />
      <div className={cn(st.sponge, "dark:visible invisible")} />
      <CenteredContainer className="flex h-[calc(100dvh_-_65px)]">
        <aside className="hidden md:flex h-full max-h-screen w-[200px] border-r">
          <Sidebar />
        </aside>
        <main className="flex-1 py-12">
          <ModalCreateNewTask>
            <Button
              size="xl"
              className="__neutral mx-auto"
            >
              <IconPlus size={16} />
              New task
            </Button>
          </ModalCreateNewTask>
        </main>
      </CenteredContainer>
    </UserInfoProvider>
  )
}

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async ({ req }) => {
  const { userId } = getAuth(req)

  return {
    props: {
      userId,
    },
  }
}
