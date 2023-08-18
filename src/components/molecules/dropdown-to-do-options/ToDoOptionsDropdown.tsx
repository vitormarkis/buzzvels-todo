import React from "react"

import { cn } from "@/lib/utils"

import { IconTrash } from "@/components/icons/IconTrash"
import { ToDoDeleteAlertDialog } from "@/components/molecules/alert-dialog-to-do-delete/ToDoDeleteAlertDialog"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { TaskSession } from "@/fetchs/tasks/schema"

export type ToDoOptionsDropdownProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
  task: TaskSession
  handleDeleteTask: (props: MutateDeleteTask) => void
}

export const ToDoOptionsDropdown = React.forwardRef<
  React.ElementRef<"div">,
  ToDoOptionsDropdownProps
>(function ToDoOptionsDropdownComponent({ handleDeleteTask, task, children, ...props }, ref) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        {...props}
        className={cn("", props.className)}
        ref={ref}
        align="end">
        <ToDoDeleteAlertDialog
          task={task}
          handleDeleteTask={handleDeleteTask}>
          <Button
            variant="ghost"
            className="h-9 px-2 py-1.5 cursor-default justify-start w-full font-normal rounded-sm">
            <IconTrash
              size={16}
              style={{ color: "inherit" }}
            />
            <span>Delete</span>
          </Button>
        </ToDoDeleteAlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

ToDoOptionsDropdown.displayName = "ToDoOptionsDropdown"
