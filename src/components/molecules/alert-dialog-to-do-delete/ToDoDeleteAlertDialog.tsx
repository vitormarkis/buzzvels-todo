import React from "react"

import { cn } from "@/lib/utils"

import { IconTrash } from "@/components/icons/IconTrash"
import { MutateDeleteTask } from "@/components/molecules/to-do/ToDo"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

import { TaskSession } from "@/fetchs/tasks/schema"

export type ToDoDeleteAlertDialogProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
  task: TaskSession
  handleDeleteTask: (props: MutateDeleteTask) => void
}

export const ToDoDeleteAlertDialog = React.forwardRef<
  React.ElementRef<"div">,
  ToDoDeleteAlertDialogProps
>(function ToDoDeleteAlertDialogComponent({ task, handleDeleteTask, children, ...props }, ref) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        {...props}
        className={cn("", props.className)}
        ref={ref}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete To-do</AlertDialogTitle>
          <div className="flex flex-col gap-2">
            <p className="__two bg-background py-2 px-4 rounded-lg text-color">{task.task}</p>
            <AlertDialogDescription>
              Are you sure you want to delete permanently this to-do?
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="default">
              <span>Cancel</span>
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() => handleDeleteTask({ taskId: task.id })}
              className="__block text-white">
              <IconTrash
                size={16}
                style={{ color: "inherit" }}
              />
              <span>Confirm</span>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
})

ToDoDeleteAlertDialog.displayName = "ToDoDeleteAlertDialog"
