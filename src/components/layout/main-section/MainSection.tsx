import { cn } from "@/lib/utils"
import { CenteredContainer } from "@/components/container/centered-container/CenteredContainer"
import { AddNewTaskButtonFloating } from "@/components/molecules/button-floating-add-new-task/AddNewTaskButtonFloating"
import { MainContent } from "@/components/organisms/main-content/MainContent"
import { Sidebar } from "@/components/organisms/sidebar/Sidebar"
import st from "@/pages/page.module.css"

export type MainSectionProps = {}

export const MainSection = ({}: MainSectionProps) => {
  return (
    <>
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[1px] h-[1px] bg-gradient-to-r from-transparent to-transparent via-color/40 max-w-xl w-full" />
      <div className={cn(st.sponge, "dark:visible invisible")} />
      <CenteredContainer className="flex min-h-[calc(100dvh_-_65px)] p-0 xs:px-4">
        <AddNewTaskButtonFloating />
        <Sidebar className="hidden md:flex h-[calc(100dvh_-_65px)]" />
        <MainContent className="flex-1" />
      </CenteredContainer>
    </>
  )
}

MainSection.displayName = "MainSection"
