import { Button } from "@/components/ui/button"
import st from "./page.module.css"
import { cn } from "@/lib/utils"
import { CenteredContainer } from "@/components/container/centered-container/CenteredContainer"
import { Header, Sidebar } from "@/components/organisms"
import { IconPlus } from "@/components/icons"
import { ModalCreateNewTask } from "@/components/modal"

export default function Home() {
  return (
    <>
      <Header />
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
    </>
  )
}
