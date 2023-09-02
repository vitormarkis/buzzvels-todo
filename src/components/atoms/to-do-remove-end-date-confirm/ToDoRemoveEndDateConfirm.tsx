import React, { useContext, useState } from "react"
import { cn } from "@/lib/utils"
import { TaskContext } from "@/contexts/task/taskContext"

export type ToDoRemoveEndDateConfirmProps = React.ComponentPropsWithoutRef<"div"> & {
  clickableElement: (props: { stage: () => void }) => React.ReactNode
  confirmElement: (props: { action: () => void }) => React.ReactNode
}

export const ToDoRemoveEndDateConfirm = React.forwardRef<
  React.ElementRef<"div">,
  ToDoRemoveEndDateConfirmProps
>(function ToDoRemoveEndDateConfirmComponent({ clickableElement, confirmElement, ...props }, ref) {
  const { task, addEndDateMutate } = useContext(TaskContext)
  const [isStaging, setIsStaging] = useState(false)

  const stage = () => setIsStaging(true)

  const action = () => {
    addEndDateMutate({
      payload: {
        endDate: null,
        taskId: task.id,
      },
      task,
    })
  }

  // {...props}
  // className={cn("", props.className)}
  // ref={ref}>

  return isStaging ? confirmElement({ action }) : clickableElement({ stage })
})

ToDoRemoveEndDateConfirm.displayName = "ToDoRemoveEndDateConfirm"
