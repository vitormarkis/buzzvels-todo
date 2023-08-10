import React, { useId, useState } from "react"
import { cn } from "@/lib/utils"
import { PadContainer } from "@/components/container/pad-container/PadContainer"
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SubtaskSession, TaskSession } from "@/fetchs/tasks/schema"
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
import { EditableLabel } from "@/components/editable-label/EditableLabel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { IconListTree } from "@/components/icons/IconListTree"
import { TodoProvider, TodoContainer, TodoCheckbox, TodoEditableLabel } from "@/components/app/todo"
import { CheckedState } from "@radix-ui/react-checkbox"
type MutateToggleTask = { taskId: string; isDone: boolean }
type MutateToggleSubtask = { subtask: SubtaskSession; isDone: CheckedState }

type MutateDeleteTask = { taskId: string }

export type ToDoProps = React.ComponentPropsWithoutRef<"div"> & {
  task: TaskSession
}

export const ToDo = React.forwardRef<React.ElementRef<"div">, ToDoProps>(function ToDoComponent(
  { task, ...props },
  ref
) {
  const [text, setText] = useState(task.task)

  const toggleIsDoneId = useId()
  const { userId } = useAuth()
  const queryClient = useQueryClient()

  const { mutate: toggleTodoMutate } = useMutation<{}, {}, MutateToggleTask>({
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

  const { mutate: toggleSubtaskMutate } = useMutation<{}, {}, MutateToggleSubtask>({
    mutationFn: ({ isDone, subtask }) => redis.hset(subtask.id, { isDone }),
    onMutate: ({ isDone, subtask }) => {
      const tasks: TaskSession[] | undefined = queryClient.getQueryData(["tasksIds", userId])
      if (!tasks) return
      const newTasks = tasks.map((task): TaskSession => {
        return task.id === subtask.taskId
          ? {
              ...task,
              subtasks: task.subtasks.map(currentSubtask =>
                currentSubtask.id === subtask.id
                  ? {
                      ...currentSubtask,
                      isDone: typeof isDone === "string" ? false : isDone,
                    }
                  : currentSubtask
              ),
            }
          : task
      })
      queryClient.setQueryData(["tasksIds", userId], newTasks)
    },
  })

  const { mutate: deleteTodoMutate } = useMutation<{}, {}, MutateDeleteTask>({
    mutationFn: async ({ taskId }) => {
      const [res] = await Promise.all([redis.del(taskId), redis.lrem(`tasks:${userId}`, 1, taskId)])
      return res
    },
    onMutate: ({ taskId }) => {
      const tasks: TaskSession[] | undefined = queryClient.getQueryData(["tasksIds", userId])
      if (!tasks) return
      const newTasks = tasks.filter(toggledTask => toggledTask.id !== taskId)
      queryClient.setQueryData(["tasksIds", userId], newTasks)
    },
  })

  const handleToggleTodo = ({ isDone, taskId }: MutateToggleTask) => {
    toggleTodoMutate({
      isDone,
      taskId,
    })
  }

  const handleToggleSubtask = ({ isDone, subtask }: MutateToggleSubtask) => {
    toggleSubtaskMutate({
      isDone,
      subtask,
    })
  }

  const handleDeleteTodo = ({ taskId }: MutateDeleteTask) => {
    deleteTodoMutate({ taskId })
  }

  const handleChangeTaskName = () => {
    const tasks: TaskSession[] | undefined = queryClient.getQueryData(["tasksIds", userId])
    if (!tasks) return
    const editingTask = tasks.find(currentTask => task.id === currentTask.id)
    if (!editingTask) return
    if (editingTask.task === text) return

    const newTasks = tasks.map(currentTask =>
      currentTask.id === task.id ? { ...currentTask, task: text } : currentTask
    )

    queryClient.setQueryData(["tasksIds", userId], newTasks)

    void redis.hset(task.id, { task: text })
  }

  return (
    <PadContainer
      {...props}
      className={cn("justify-between relative pr-3.5", props.className)}
      ref={ref}
    >
      <Accordion
        type="single"
        collapsible
        className="flex-1"
      >
        <AccordionItem
          value="item-1"
          className="flex flex-col"
        >
          <div className="flex">
            <div className="flex items-center gap-2 flex-1">
              <Checkbox
                checked={task.isDone}
                onCheckedChange={isDone => handleToggleTodo({ isDone: !!isDone, taskId: task.id })}
                size="big"
              />
              <EditableLabel
                state={[text, setText]}
                data-completed={task.isDone}
                taskId={task.id}
                className="flex-1 py-4 data-[completed=true]:text-color data-[completed=true]:line-through text-lg"
                onAction={handleChangeTaskName}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <AccordionTrigger asChild>
                <Button className="h-8 w-8 p-0">
                  <IconListTree />
                </Button>
              </AccordionTrigger>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button className="h-8 w-8 p-0">
                    <IconThreeDotsVertical className="text-color-strong" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-9 px-2 py-1.5 cursor-default justify-start w-full font-normal"
                      >
                        <IconTrash
                          size={16}
                          style={{ color: "inherit" }}
                        />
                        <span>Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently this to-do.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button
                            variant="default"
                            className="__neutral"
                          >
                            <span>Cancel</span>
                          </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button
                            onClick={() => handleDeleteTodo({ taskId: task.id })}
                            className="__block"
                          >
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
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <AccordionContent className="flex data-[state=open]:pb-4 w-full">
            <div className="px-3">
              <div className="h-full border-r" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              {task.subtasks.length > 0 ? (
                task.subtasks.map(subtask => (
                  <TodoProvider
                    onLabelChange={newValue =>
                      console.log(`Label received a new value: ${newValue}.`)
                    }
                    onCheckedChange={isDone => handleToggleSubtask({ isDone, subtask })}
                    checked={subtask.isDone}
                    initialLabelValue={subtask.task}
                  >
                    <TodoContainer>
                      <TodoCheckbox />
                      <TodoEditableLabel disableActionOnNoChange />
                    </TodoContainer>
                  </TodoProvider>
                ))
              ) : (
                <span className="text-xs text-color-soft">No subtasks</span>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PadContainer>
  )
})

export type ToDoSkeletonProps = React.ComponentPropsWithoutRef<"div"> & {}

export const ToDoSkeleton = React.forwardRef<React.ElementRef<"div">, ToDoSkeletonProps>(
  function ToDoSkeletonComponent({ children, ...props }, ref) {
    return (
      <PadContainer
        {...props}
        className={cn("__first justify-between animate-pulse", props.className)}
        ref={ref}
      >
        <div className="flex items-center gap-2 flex-1">
          <Checkbox
            checked={false}
            size="big"
          />
          <div className="w-full px-4 py-2">
            <div className="__two h-5 rounded bg-background animate-pulse w-full max-w-[14rem]" />
          </div>
        </div>
      </PadContainer>
    )
  }
)

ToDoSkeleton.displayName = "ToDoSkeleton"
ToDo.displayName = "ToDo"
