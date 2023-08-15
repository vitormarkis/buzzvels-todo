import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { PadContainer } from "@/components/container/pad-container/PadContainer"
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SubtaskSession, TaskSession } from "@/fetchs/tasks/schema"
import { useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { IconThreeDotsVertical } from "@/components/icons/IconThreeDotsVertical"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
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
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { IconListTree } from "@/components/icons/IconListTree"
import {
  TodoProvider,
  TodoContainer,
  TodoCheckbox,
  TodoEditableLabel,
  TodoActionsContainer,
  TodoAction,
} from "@/components/app/todo"
import { CheckedState } from "@radix-ui/react-checkbox"
import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import {
  MutateCreateNewSubtask,
  MutateCreateNewSubtaskInput,
  mutateCreateNewSubtaskSchema,
} from "@/schemas/subtask/create"
import { IconPlus, IconX } from "@/components/icons"
import {
  MutateDeleteSubtaskInput,
  SubtaskRequestBodySchemaInput,
  mutateDeleteSubtaskSchema,
} from "@/schemas/subtask/delete"
import { nanoid } from "nanoid"
import { createQueryCache } from "@/factories/createQueryCache"
import {
  MutateChangeSubtaskTextInput,
  mutateChangeSubtaskTextSchema,
} from "@/schemas/subtask/change"
import { MutateChangeTaskTextInput, mutateChangeTaskTextSchema } from "@/schemas/task/change"
import { useToast } from "@/components/ui/use-toast"
import { changeSubtaskTextMutationFunction } from "@/services/react-query/mutations/changeSubtaskTextMutationFunction"
import { deleteTaskMutationFunction } from "@/services/react-query/mutations/deleteTaskMutationFunction"
import { toggleSubtaskMutationFunction } from "@/services/react-query/mutations/toggleSubtaskMutationFunction"
import { toggleTaskMutationFunction } from "@/services/react-query/mutations/toggleTodoMutationFunction"
import { changeTaskTextMutationFunction } from "@/services/react-query/mutations/changeTaskTextMutationFunction"

export type MutateToggleTask = { taskId: string; isDone: boolean }
export type MutateToggleSubtask = { subtask: SubtaskSession; isDone: CheckedState }
export type MutateDeleteTask = { taskId: string }

export type ToDoProps = React.ComponentPropsWithoutRef<"div"> & {
  task: TaskSession
}

export const ToDo = React.forwardRef<React.ElementRef<"div">, ToDoProps>(function ToDoComponent(
  { task, ...props },
  ref
) {
  const [text, setText] = useState(task.task)
  const [isNewSubtaskDone, setIsNewSubtaskDone] = useState<CheckedState>(false)
  const [isAddingNewSubtask, setIsAddingNewSubtask] = useState(false)
  const [whichAccordionOpen, setWhichAccordionOpen] = useState("")
  const { toast } = useToast()

  const { headers } = useUserInfo()
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const QueryCache = createQueryCache(queryClient, userId)

  const { mutate: toggleTaskMutate } = useMutation<{}, {}, MutateToggleTask>({
    mutationFn: payload => toggleTaskMutationFunction(payload, headers),
    onMutate: ({ taskId, isDone }) => QueryCache.tasks.toggle(taskId, isDone),
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to toggle task",
        description: (
          <>
            Something went wrong on our server during the toggle of your task,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    retry: 2,
  })

  const { mutate: toggleSubtaskMutate } = useMutation<{}, {}, MutateToggleSubtask>({
    mutationFn: payload => toggleSubtaskMutationFunction(payload, headers),
    onMutate: ({ isDone, subtask }) => QueryCache.subtasks.toggle(isDone, subtask),
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to toggle sub-task",
        description: (
          <>
            Something went wrong on our server during the toggle of your sub-task,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    retry: 2,
  })

  const { mutate: deleteTaskMutate } = useMutation<{}, {}, MutateDeleteTask>({
    mutationFn: payload => deleteTaskMutationFunction(payload, headers),
    onMutate: ({ taskId }) => QueryCache.tasks.remove(taskId),
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: (
          <>
            Something went wrong on our server during the deletion of your task,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    retry: 3,
  })

  const { mutate: changeSubtaskTextMutate } = useMutation<{}, {}, MutateChangeSubtaskTextInput>({
    mutationFn: payload => changeSubtaskTextMutationFunction(payload, headers),
    onMutate: ({ subtaskId, text }) => QueryCache.subtasks.changeText(subtaskId, text),
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to change sub-task text",
        description: (
          <>
            Something went wrong on our server during the change of your sub-task text,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    retry: 3,
  })

  const { mutate: changeTaskTextMutate } = useMutation<{}, {}, MutateChangeTaskTextInput>({
    mutationFn: payload => changeTaskTextMutationFunction(payload, headers),
    onMutate: ({ taskId, text }) => QueryCache.tasks.changeText(taskId, text),
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to change task text",
        description: (
          <>
            Something went wrong on our server during the change of your task text,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    retry: 3,
  })

  const { mutate: createNewSubtaskMutate } = useMutation<{}, {}, MutateCreateNewSubtaskInput>({
    mutationFn: async ({ isDone, task, taskId }) =>
      fetch("/api/subtask", {
        body: JSON.stringify({ isDone, task, taskId }),
        headers,
        method: "POST",
      }),
    onMutate: ({ taskId, task }) => {
      QueryCache.subtasks.add({
        id: nanoid(),
        isDone: !!isNewSubtaskDone,
        createdAt: new Date().getTime(),
        task,
        taskId,
      })
      resetNewSubtaskState()
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to create sub-task",
        description: (
          <>
            Something went wrong on our server during the creation of your sub-task,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasksIds", userId])
    },
    retry: 3,
  })

  const { mutate: deleteSubtaskMutate } = useMutation<{}, {}, MutateDeleteSubtaskInput>({
    mutationFn: ({ id }: SubtaskRequestBodySchemaInput) =>
      fetch("/api/subtask", {
        body: JSON.stringify({ id }),
        headers,
        method: "DELETE",
      }),
    onMutate: ({ id: subtaskId, taskId }) => {
      QueryCache.subtasks.remove(subtaskId, taskId, {
        onRemoveLastOne: () => {
          setWhichAccordionOpen("")
          resetNewSubtaskState()
        },
      })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to delete sub-task",
        description: (
          <>
            Something went wrong on our server during the deletion of your sub-task,{" "}
            <strong>please try again.</strong>
          </>
        ),
      })
    },
    retry: 3,
  })

  const handleToggleTodo = ({ isDone, taskId }: MutateToggleTask) => {
    toggleTaskMutate({
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

  const handleDeleteTask = ({ taskId }: MutateDeleteTask) => {
    deleteTaskMutate({ taskId })
  }

  const handleChangeTaskName = (props: MutateChangeTaskTextInput) => {
    const { taskId, text } = mutateChangeTaskTextSchema.parse(props)
    changeTaskTextMutate({ taskId, text })
  }

  const handleChangeSubtaskText = (props: MutateChangeSubtaskTextInput) => {
    const { subtaskId, text } = mutateChangeSubtaskTextSchema.parse(props)
    changeSubtaskTextMutate({ subtaskId, text })
  }

  const handleCreateNewSubtask = (props: MutateCreateNewSubtaskInput) => {
    const { isDone, task, taskId } = mutateCreateNewSubtaskSchema.parse(props)
    createNewSubtaskMutate({ isDone, task, taskId })
  }

  const handleDeleteSubtask = (props: MutateDeleteSubtaskInput) => {
    const { id, taskId } = mutateDeleteSubtaskSchema.parse(props)
    deleteSubtaskMutate({ id, taskId })
  }

  const setAccordion = (openingAccordion: string) => (currentOpenAccordion: string) =>
    currentOpenAccordion === openingAccordion ? "" : openingAccordion

  const handleToggleAccordion = {
    subtasks: () => setWhichAccordionOpen(setAccordion("subtasks")),
  }

  function resetNewSubtaskState() {
    setIsAddingNewSubtask(false)
    setIsNewSubtaskDone(false)
  }

  return (
    <PadContainer
      {...props}
      className={cn(
        "min-h-[3rem] py-0 px-4 justify-between relative overflow-hidden",
        props.className
      )}
      ref={ref}
    >
      <Accordion
        type="single"
        collapsible
        className="flex-1"
        value={whichAccordionOpen}
        onValueChange={setWhichAccordionOpen}
      >
        <AccordionItem
          value="subtasks"
          className="flex flex-col"
        >
          <div className="flex">
            <div className="flex items-center gap-2 flex-1">
              <Checkbox
                checked={task.isDone}
                onCheckedChange={isDone => handleToggleTodo({ isDone: !!isDone, taskId: task.id })}
              />
              <EditableLabel
                state={[text, setText]}
                data-completed={task.isDone}
                taskId={task.id}
                className="flex-1"
                onAction={newValue => handleChangeTaskName({ taskId: task.id, text: newValue })}
              />
            </div>
            <div className="flex items-center gap-1.5">
              {/* <AccordionTrigger asChild> */}
              <Button
                data-nosubtasks={task.subtasks.length === 0}
                className="h-8 w-8 p-0 data-[nosubtasks=true]:opacity-50 data-[nosubtasks=true]:hover:opacity-100 transition"
                onClick={handleToggleAccordion["subtasks"]}
              >
                <IconListTree />
              </Button>
              {/* </AccordionTrigger> */}
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
                            onClick={() => handleDeleteTask({ taskId: task.id })}
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
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                {task.subtasks.length > 0 ? (
                  task.subtasks.map(subtask => (
                    <TodoProvider
                      key={subtask.id}
                      onCheckedChange={isDone => handleToggleSubtask({ isDone, subtask })}
                      checked={subtask.isDone}
                      initialLabelValue={subtask.task}
                      onLabelChange={newValue =>
                        handleChangeSubtaskText({ subtaskId: subtask.id, text: newValue })
                      }
                    >
                      <TodoContainer>
                        <TodoCheckbox />
                        <TodoEditableLabel
                          disableActionOnNoChange
                          taskId={subtask.id}
                          padding="v-small"
                        />
                        <TodoActionsContainer>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <TodoAction>
                                <IconX size={14} />
                              </TodoAction>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently this subtask.
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
                                    onClick={() =>
                                      handleDeleteSubtask({
                                        id: subtask.id,
                                        taskId: task.id,
                                      })
                                    }
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
                        </TodoActionsContainer>
                      </TodoContainer>
                    </TodoProvider>
                  ))
                ) : (
                  // NOSUBTASKS
                  <TodoProvider
                    onCheckedChange={setIsNewSubtaskDone}
                    checked={isNewSubtaskDone}
                    initialLabelValue=""
                    onLabelChange={newText =>
                      handleCreateNewSubtask({
                        taskId: task.id,
                        isDone: !!isNewSubtaskDone,
                        task: newText,
                      })
                    }
                  >
                    <TodoContainer>
                      <TodoCheckbox />
                      <TodoEditableLabel
                        selectAutoFocus
                        disableAction
                        padding="v-small"
                        textStyle="new"
                      />
                      <TodoActionsContainer>
                        <TodoAction className="__neutral bg-background">
                          <IconPlus size={14} />
                        </TodoAction>
                        <TodoAction
                          onClick={() => {
                            setWhichAccordionOpen("")
                            resetNewSubtaskState()
                          }}
                        >
                          <IconX size={14} />
                        </TodoAction>
                      </TodoActionsContainer>
                    </TodoContainer>
                  </TodoProvider>
                )}
                {task.subtasks.length > 0 && isAddingNewSubtask && (
                  // ADDNEWSUBTASK
                  <TodoProvider
                    onCheckedChange={setIsNewSubtaskDone}
                    checked={isNewSubtaskDone}
                    initialLabelValue=""
                    onLabelChange={newText =>
                      handleCreateNewSubtask({
                        taskId: task.id,
                        isDone: !!isNewSubtaskDone,
                        task: newText,
                      })
                    }
                  >
                    <TodoContainer>
                      <TodoCheckbox />
                      <TodoEditableLabel
                        selectAutoFocus
                        disableAction
                        padding="v-small"
                        textStyle="new"
                      />
                      <TodoActionsContainer>
                        <TodoAction className="__neutral bg-background">
                          <IconPlus size={14} />
                        </TodoAction>
                        <TodoAction
                          onClick={() => {
                            const hasNoSubtask = task.subtasks.length === 0
                            if (hasNoSubtask) setWhichAccordionOpen("")
                            resetNewSubtaskState()
                          }}
                        >
                          <IconX size={14} />
                        </TodoAction>
                      </TodoActionsContainer>
                    </TodoContainer>
                  </TodoProvider>
                )}
              </div>
              <Button
                data-disabled={isAddingNewSubtask}
                onClick={() => setIsAddingNewSubtask(true)}
                className="__neutral disabled:opacity-50 disabled:cursor-not-allowed ml-2 h-5 text-xs w-fit pr-4 pl-2"
                disabled={isAddingNewSubtask}
              >
                <IconPlus size={10} />
                New task
              </Button>
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
        className={cn("__first justify-between animate-pulse px-4", props.className)}
        ref={ref}
      >
        <div className="flex items-center gap-2 flex-1">
          <Checkbox checked={false} />
          <div className="w-full px-1.5 py-3.5">
            <div className="__two h-5 rounded bg-background animate-pulse w-full max-w-[14rem]" />
          </div>
        </div>
      </PadContainer>
    )
  }
)

ToDoSkeleton.displayName = "ToDoSkeleton"
ToDo.displayName = "ToDo"
