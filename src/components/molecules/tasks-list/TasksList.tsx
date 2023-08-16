import React from "react"
import { cn } from "@/lib/utils"
import { ToDo, ToDoSkeleton } from "@/components/molecules/to-do/ToDo"
import { PadWrapper } from "@/components/container/pad-container/PadWrapper"
import { TaskSession } from "@/fetchs/tasks/schema"
import { IconFolderOpen } from "@/components/icons/IconFolderOpen"

export type TasksListProps = React.ComponentPropsWithoutRef<"div"> & {
  isLoadingNewTask: boolean
  tasks: TaskSession[] | null
}

export const TasksList = React.forwardRef<React.ElementRef<"div">, TasksListProps>(
  function TasksListComponent({ tasks, isLoadingNewTask, ...props }, ref) {
    return (
      <>
        {isLoadingNewTask && <ToDoSkeleton />}
        <PadWrapper
          {...props}
          className={cn("p-0", props.className)}
          ref={ref}
        >
          {tasks?.length && tasks.length > 0 ? (
            tasks.map(task => (
              <ToDo
                key={task.id}
                className="__first"
                task={task}
              />
            ))
          ) : (
            <>
              {!isLoadingNewTask && (
                <div className="py-4 flex flex-col gap-2 items-center">
                  <h3 className="text-center text-color-soft text-xl">There is no tasks yet.</h3>
                  <IconFolderOpen
                    size={80}
                    className="text-color-soft"
                  />
                </div>
              )}
            </>
          )}
        </PadWrapper>
      </>
    )
  }
)

TasksList.displayName = "TasksList"
