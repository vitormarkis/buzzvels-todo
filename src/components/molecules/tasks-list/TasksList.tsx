import React from "react"

import { useAuth } from "@clerk/nextjs"

import { cn } from "@/lib/utils"

import { PadWrapper } from "@/components/container/pad-container/PadWrapper"
import { IconFolderOpen } from "@/components/icons/IconFolderOpen"
import { ToDo, ToDoSkeleton } from "@/components/molecules/to-do/ToDo"

import { TaskProvider } from "@/contexts/task/taskContext"
import { TasksContextProvider, useTasksContext } from "@/contexts/tasks/tasksContext"

export type TasksListProps = React.ComponentPropsWithoutRef<"div"> & {}

export const TasksList = React.forwardRef<React.ElementRef<"div">, TasksListProps>(
  function TasksListComponent({ ...props }, ref) {
    return (
      <TasksContextProvider>
        <PadWrapper
          {...props}
          className={cn("gap-1.5", props.className)}
          ref={ref}>
          <TasksDisplayed />
        </PadWrapper>
      </TasksContextProvider>
    )
  }
)

TasksList.displayName = "TasksList"

export type TasksDisplayedProps = {}

export function TasksDisplayed({}: TasksDisplayedProps) {
  const { sessionId } = useAuth()
  const { tasks, useTasksQuery } = useTasksContext()
  const { isLoading } = useTasksQuery

  if ((tasks && tasks.length === 0) || !sessionId)
    return (
      <div className="py-4 flex flex-col gap-2 items-center">
        <h3 className="text-center text-color-soft text-xl">There is no tasks yet.</h3>
        <IconFolderOpen
          size={80}
          className="text-color-soft"
        />
      </div>
    )

  if (isLoading || tasks === null)
    // if (true)
    return (
      <div className="flex flex-col gap-2">
        <ToDoSkeleton />
        <ToDoSkeleton />
        <ToDoSkeleton />
        <ToDoSkeleton />
      </div>
    )

  return tasks.map(task => (
    <TaskProvider
      key={task.id}
      task={task}>
      <ToDo
        key={task.id}
        className="__first"
        task={task}
      />
    </TaskProvider>
  ))
}
