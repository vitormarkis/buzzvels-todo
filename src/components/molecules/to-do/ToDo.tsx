import { nanoid } from "nanoid"
import React, { useState } from "react"

import { useAuth } from "@clerk/nextjs"
import { CheckedState } from "@radix-ui/react-checkbox"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { cn } from "@/lib/utils"

import {
  TodoAction,
  TodoActionsContainer,
  TodoCheckbox,
  TodoContainer,
  TodoEditableLabel,
  TodoProvider,
} from "@/components/app/todo"
import { PadContainer } from "@/components/container/pad-container/PadContainer"
import { EditableLabel } from "@/components/editable-label/EditableLabel"
import { IconPlus, IconX } from "@/components/icons"
import { IconListTree } from "@/components/icons/IconListTree"
import { IconThreeDotsVertical } from "@/components/icons/IconThreeDotsVertical"
import { SubtaskDeleteAlertDialog } from "@/components/molecules/alert-dialog-subtask-delete/SubtaskDeleteAlertDialog"
import { ToDoOptionsDropdown } from "@/components/molecules/dropdown-to-do-options/ToDoOptionsDropdown"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

import { createQueryCache } from "@/factories/createQueryCache"

import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { SubtaskSession, TaskSession } from "@/fetchs/tasks/schema"
import {
  MutateChangeSubtaskTextInput,
  mutateChangeSubtaskTextSchema,
} from "@/schemas/subtask/change"
import { MutateChangeTaskTextInput, mutateChangeTaskTextSchema } from "@/schemas/task/change"
import {
  changeSubtaskTextMutationFunction,
  changeTaskTextMutationFunction,
  deleteTaskMutationFunction,
  toggleSubtaskMutationFunction,
  toggleTaskMutationFunction,
} from "@/services/react-query/mutations"
import {
  MutateCreateNewSubtaskInput,
  createNewSubtaskMutationFunction,
  mutateCreateNewSubtaskSchema,
} from "@/services/react-query/mutations/createNewSubtaskMutationFunction"

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
    mutationFn: props => createNewSubtaskMutationFunction(props, headers),
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
    <div className={cn("relative", task.endDate && "mt-1.5 xs:mt-0")}>
      {task.endDate && (
        <div className="__action absolute z-10 right-3 -top-1.5 flex xs:hidden items-center h-4 text-xs rounded-full px-4 bg-background text-color-strong">
          <span>{new Date(task.endDate).toLocaleDateString()}</span>
        </div>
      )}
      <PadContainer
        {...props}
        className={cn(
          "min-h-[3rem] py-0 px-4 justify-between relative overflow-hidden rounded-none xs:rounded-[0.625rem]",
          props.className
        )}
        ref={ref}>
        <Accordion
          type="single"
          collapsible
          className="flex-1"
          value={whichAccordionOpen}
          onValueChange={setWhichAccordionOpen}>
          <AccordionItem
            value="subtasks"
            className="flex flex-col">
            <div className="flex gap-2">
              <div className="flex items-start gap-2 flex-1">
                <Checkbox
                  checked={task.isDone}
                  onCheckedChange={isDone =>
                    handleToggleTodo({ isDone: !!isDone, taskId: task.id })
                  }
                  className="mt-7 xs:mt-3.5"
                />
                <div className="flex w-full grow items-center py-3 xs:py-0 xs:gap-2">
                  <EditableLabel
                    state={[text, setText]}
                    isCompleted={task.isDone}
                    taskId={task.id}
                    className="flex-1"
                    onAction={newValue => handleChangeTaskName({ taskId: task.id, text: newValue })}
                  />
                  {task.endDate && (
                    <div className="__action hidden xs:flex items-center h-4 text-xs rounded-full px-4 bg-background text-color-strong">
                      <span>{new Date(task.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  data-nosubtasks={task.subtasks.length === 0}
                  className="h-8 w-8 p-0 data-[nosubtasks=true]:opacity-50 data-[nosubtasks=true]:hover:opacity-100 transition"
                  onClick={handleToggleAccordion["subtasks"]}>
                  <IconListTree />
                </Button>
                <ToDoOptionsDropdown
                  handleDeleteTask={handleDeleteTask}
                  task={task}>
                  <Button className="h-8 w-8 p-0">
                    <IconThreeDotsVertical className="text-color-strong" />
                  </Button>
                </ToDoOptionsDropdown>
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
                        }>
                        <TodoContainer>
                          <TodoCheckbox />
                          <TodoEditableLabel
                            disableActionOnNoChange
                            taskId={subtask.id}
                            padding="v-small"
                          />
                          <TodoActionsContainer>
                            <SubtaskDeleteAlertDialog
                              subtask={subtask}
                              resetNewSubtaskState={resetNewSubtaskState}
                              setWhichAccordionOpen={setWhichAccordionOpen}>
                              <TodoAction>
                                <IconX size={14} />
                              </TodoAction>
                            </SubtaskDeleteAlertDialog>
                          </TodoActionsContainer>
                        </TodoContainer>
                      </TodoProvider>
                    ))
                  ) : (
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
                      }>
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
                            }}>
                            <IconX size={14} />
                          </TodoAction>
                        </TodoActionsContainer>
                      </TodoContainer>
                    </TodoProvider>
                  )}
                  {task.subtasks.length > 0 && isAddingNewSubtask && (
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
                      }>
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
                            }}>
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
                  disabled={isAddingNewSubtask}>
                  <IconPlus
                    size={10}
                    className="text-color-strong"
                  />
                  <span>New task</span>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </PadContainer>
    </div>
  )
})

export type ToDoSkeletonProps = React.ComponentPropsWithoutRef<"div"> & {}

export const ToDoSkeleton = React.forwardRef<React.ElementRef<"div">, ToDoSkeletonProps>(
  function ToDoSkeletonComponent({ children, ...props }, ref) {
    return (
      <PadContainer
        {...props}
        className={cn(
          "__first justify-between animate-pulse px-4 rounded-none xs:rounded-[0.625rem]",
          props.className
        )}
        ref={ref}>
        <div className="flex items-center gap-2 flex-1">
          <Checkbox checked={false} />
          <div className="w-full px-1.5 py-[1.625rem] xs:py-3.5">
            <div className="__two h-5 rounded bg-background animate-pulse w-full max-w-[14rem]" />
          </div>
        </div>
      </PadContainer>
    )
  }
)

ToDoSkeleton.displayName = "ToDoSkeleton"
ToDo.displayName = "ToDo"
