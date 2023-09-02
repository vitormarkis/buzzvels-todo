import React from "react"
import { cn } from "@/lib/utils"
import { PadWrapper } from "@/components/container/pad-container/PadWrapper"
import { IconPlus } from "@/components/icons"
import { ModalCreateNewTask } from "@/components/modal"
import { SortingBar } from "@/components/molecules/sorting-bar/SortingBar"
import { TasksList } from "@/components/molecules/tasks-list/TasksList"
import { Button } from "@/components/ui/button"

export type MainContentProps = React.ComponentPropsWithoutRef<"main"> & {}

export const MainContent = React.forwardRef<React.ElementRef<"main">, MainContentProps>(
  function MainContentComponent({ ...props }, ref) {
    return (
      <main
        {...props}
        className={cn("pt-12 pb-24 px-0 sm:px-6 overflow-x-hidden", props.className)}
        ref={ref}
      >
        <ModalCreateNewTask>
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
    )
  }
)

MainContent.displayName = "MainContent"
