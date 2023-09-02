import React from "react"
import { useAuth } from "@clerk/nextjs"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { IconTrash } from "@/components/icons/IconTrash"
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
import { toast } from "@/components/ui/use-toast"
import { createQueryCache } from "@/factories/createQueryCache"
import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { SubtaskSession } from "@/fetchs/tasks/schema"
import { MutateDeleteSubtaskInput, mutateDeleteSubtaskSchema } from "@/schemas/subtask/delete"
import { deleteSubtaskMutationFunction } from "@/services/react-query/mutations/deleteSubtaskMutationFunction"

export type SubtaskDeleteAlertDialogProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
  subtask: SubtaskSession
  resetNewSubtaskState(): void
  setWhichAccordionOpen: React.Dispatch<React.SetStateAction<string>>
}

export const SubtaskDeleteAlertDialog = React.forwardRef<
  React.ElementRef<"div">,
  SubtaskDeleteAlertDialogProps
>(function SubtaskDeleteAlertDialogComponent(
  { setWhichAccordionOpen, resetNewSubtaskState, subtask, children, ...props },
  ref
) {
  const { headers } = useUserInfo()
  const { userId } = useAuth()
  const queryClient = useQueryClient()
  const QueryCache = createQueryCache(queryClient, userId)

  const { mutate: deleteSubtaskMutate } = useMutation<{}, {}, MutateDeleteSubtaskInput>({
    mutationFn: payload => deleteSubtaskMutationFunction(payload, headers),
    onMutate: ({ subtaskId, taskId }) => {
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

  const handleDeleteSubtask = (props: MutateDeleteSubtaskInput) => {
    const { subtaskId, taskId } = mutateDeleteSubtaskSchema.parse(props)
    deleteSubtaskMutate({ subtaskId, taskId })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent
        {...props}
        className={cn("", props.className)}
        ref={ref}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Sub-task</AlertDialogTitle>
          <div className="flex flex-col gap-2">
            <p className="__two bg-background py-2 px-4 rounded-lg text-color-strong">
              {subtask.task}
            </p>
            <AlertDialogDescription>
              Are you sure you want to delete permanently this sub-task?
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
              onClick={() =>
                handleDeleteSubtask({
                  subtaskId: subtask.id,
                  taskId: subtask.taskId,
                })
              }
              className="__block text-white"
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
  )
})
SubtaskDeleteAlertDialog.displayName = "SubtaskDeleteAlertDialog"
