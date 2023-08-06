import React, { useId } from "react"
import { cn } from "@/lib/utils"
import { PadContainer } from "@/components/container/pad-container/PadContainer"
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TaskSession } from "@/fetchs/tasks/schema"
import { redis } from "@/lib/redis"
import { Label } from "@/components/ui/label"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { IconThreeDotsVertical } from "@/components/icons/IconThreeDotsVertical"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { IconTrash } from "@/components/icons/IconTrash"
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

type MutateToggleTask = { taskId: string; isDone: boolean }

export type ToDoProps = React.ComponentPropsWithoutRef<"div"> & {
  task: TaskSession
}

export const ToDo = React.forwardRef<React.ElementRef<"div">, ToDoProps>(function ToDoComponent(
  { task, ...props },
  ref
) {
  const toggleIsDoneId = useId()
  const { userId } = useAuth()
  const queryClient = useQueryClient()

  const { mutate } = useMutation<{}, {}, MutateToggleTask>({
    mutationFn: ({ isDone, taskId }) => redis.hset(taskId, { isDone }),
    onMutate: ({ isDone, taskId }) => {
      const tasks: TaskSession[] | undefined = queryClient.getQueryData(["tasksIds", userId])
      if (!tasks) return
      const newTasks = tasks.map(toggledTask =>
        toggledTask.id === taskId
          ? {
              ...toggledTask,
              isDone,
            }
          : toggledTask
      )
      queryClient.setQueryData(["tasksIds", userId], newTasks)
    },
  })

  const handleToggleTodo = ({ isDone, taskId }: MutateToggleTask) => {
    mutate({
      isDone,
      taskId,
    })
  }

  return (
    <PadContainer
      {...props}
      className={cn("justify-between", props.className)}
      ref={ref}
    >
      <div className="flex items-center gap-2 flex-1">
        <Checkbox
          checked={task.isDone}
          id={toggleIsDoneId}
          onCheckedChange={isDone => handleToggleTodo({ isDone: !!isDone, taskId: task.id })}
          size="big"
        />
        <Label
          htmlFor={toggleIsDoneId}
          data-completed={task.isDone}
          className="data-[completed=true]:text-color data-[completed=true]:line-through text-lg"
        >
          {task.task}
        </Label>
      </div>
      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button className="h-8 w-8 p-0">
              <IconThreeDotsVertical className="text-color-strong" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <IconTrash
                    size={16}
                    style={{ color: "inherit" }}
                  />
                  <span>Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently this to-do.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                    <IconTrash
                      size={16}
                      style={{ color: "inherit" }}
                    />
                    <span>Delete</span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </PadContainer>
  )
})

ToDo.displayName = "ToDo"
