import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import { IconWrite } from "@/components/icons/IconWrite"
import { ModalCreateNewTask } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { useScrollPosition } from "@/hooks/useScrollPosition"

export type AddNewTaskButtonFloatingProps = React.ComponentPropsWithoutRef<"div"> & {}

export const AddNewTaskButtonFloating = React.forwardRef<
  React.ElementRef<"div">,
  AddNewTaskButtonFloatingProps
>(function AddNewTaskButtonFloatingComponent({ ...props }, ref) {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useScrollPosition(setIsButtonVisible, {
    range: [120, Infinity],
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted && isButtonVisible
    ? createPortal(
        <div
          {...props}
          className={cn("absolute z-40 bottom-12 right-12 pointer-events-auto", props.className)}
          ref={ref}
        >
          <ModalCreateNewTask>
            <Button className="__neutral">
              <IconWrite />
              <span>New task</span>
            </Button>
          </ModalCreateNewTask>
        </div>,
        document.querySelector("#portal")!
      )
    : null
})

AddNewTaskButtonFloating.displayName = "AddNewTaskButtonFloating"
