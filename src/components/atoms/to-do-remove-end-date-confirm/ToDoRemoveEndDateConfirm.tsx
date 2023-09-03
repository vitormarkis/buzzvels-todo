import React, { useContext, useState } from "react"
import { Slot } from "@radix-ui/react-slot"
import { TaskContext } from "@/contexts/task/taskContext"

export type ToDoRemoveEndDateConfirmProps = React.ComponentPropsWithoutRef<"div"> & {
  clickableElement: JSX.Element
  confirmElement: JSX.Element
}

export const ToDoRemoveEndDateConfirm = ({
  clickableElement,
  confirmElement,
}: ToDoRemoveEndDateConfirmProps) => {
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

  const ClickableElement = <Slot onClick={stage}>{clickableElement}</Slot>

  const ConfirmElement = <Slot onClick={action}>{confirmElement}</Slot>

  return isStaging ? ConfirmElement : ClickableElement
}
