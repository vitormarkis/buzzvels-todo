import { GetServerSideProps } from "next"
import { User, buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server"
import { MainSection } from "@/components/layout/main-section/MainSection"
import { Header } from "@/components/organisms"
import { ClerkBuilder } from "@/types/clerkBuilder"

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
  return (
    <>
      <Header user={user} />
      <MainSection />
    </>
  )
}
