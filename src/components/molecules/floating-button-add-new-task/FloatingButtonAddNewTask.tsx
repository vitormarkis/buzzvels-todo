import React from "react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { UseMutateFunction } from "@tanstack/react-query"

import { cn } from "@/lib/utils"

import { IconWrite } from "@/components/icons/IconWrite"
import { ModalCreateNewTask } from "@/components/modal"
import { Button } from "@/components/ui/button"

import { useScrollPosition } from "@/hooks/useScrollPosition"

import { TaskSession } from "@/fetchs/tasks/schema"
import { CreateNewTaskForm } from "@/form/create-new-task/schema"

export type FloatingButtonAddNewTaskProps = React.ComponentPropsWithoutRef<"div"> & {
  createNewTodoMutate: UseMutateFunction<TaskSession, any, CreateNewTaskForm & { taskId: string }>
}

export const FloatingButtonAddNewTask = React.forwardRef<
  React.ElementRef<"div">,
  FloatingButtonAddNewTaskProps
>(function FloatingButtonAddNewTaskComponent({ createNewTodoMutate, ...props }, ref) {
  const [floatingNewTaskVisible, setFloatingNewTaskVisible] = useState(false)

  const [isMounted, setIsMounted] = useState(false)

  useScrollPosition(setFloatingNewTaskVisible, {
    range: [120, Infinity],
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted && floatingNewTaskVisible
    ? createPortal(
        <div
          {...props}
          className={cn("absolute z-40 bottom-12 right-12 pointer-events-auto", props.className)}
          ref={ref}
        >
          <ModalCreateNewTask mutate={createNewTodoMutate}>
            <Button className="__neutral">
              <IconWrite />
              <span>New task</span>
            </Button>
          </ModalCreateNewTask>
        </div>,
        document.querySelector("#portal")!
      )
    : null
})

FloatingButtonAddNewTask.displayName = "FloatingButtonAddNewTask"
