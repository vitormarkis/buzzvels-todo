import React, { createContext, useContext, useState } from "react"

import { cn } from "@/lib/utils"

import { IconCalendar } from "@/components/icons/IconCalendar"
import { IconTrash } from "@/components/icons/IconTrash"
import { ToDoAddEndDateAlertDialog } from "@/components/molecules/alert-dialog-to-do-add-end-date/ToDoAddEndDateAlertDialog"
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
  const { isDropdownOpen, setIsDropdownOpen } = useContext(ToDoOptionsDropdownContext)

  return (
    <DropdownMenu
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}>
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
        <ToDoAddEndDateAlertDialog task={task}>
          <Button
            variant="ghost"
            className="h-9 px-2 py-1.5 cursor-default justify-start w-full font-normal rounded-sm">
            <IconCalendar
              size={16}
              style={{ color: "inherit" }}
            />
            <span>{task.endDate ? "Change end date" : "Add end date"}</span>
          </Button>
        </ToDoAddEndDateAlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

ToDoOptionsDropdown.displayName = "ToDoOptionsDropdown"

export interface IToDoOptionsDropdownContext {
  isDropdownOpen: boolean
  setIsDropdownOpen: (isOpen: boolean) => void
}

export const ToDoOptionsDropdownContext = createContext({} as IToDoOptionsDropdownContext)

export function ToDoOptionsDropdownProvider(props: { children: React.ReactNode }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const setIsDropdownOpenHandler = (isOpen: boolean) => {
    if (!isOpen) document.body.style.pointerEvents = "all"
    setIsDropdownOpen(isOpen)
  }

  return (
    <ToDoOptionsDropdownContext.Provider
      value={{
        isDropdownOpen,
        setIsDropdownOpen: setIsDropdownOpenHandler,
      }}>
      {props.children}
    </ToDoOptionsDropdownContext.Provider>
  )
}
