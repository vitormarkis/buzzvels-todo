import React from "react"

import { cn } from "@/lib/utils"

export type SlightContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const SlightContainer = React.forwardRef<React.ElementRef<"div">, SlightContainerProps>(
  function SlightContainerComponent({ children, ...props }, ref) {
    return (
      <div
        {...props}
        className={cn("flex items-center p-1.5 gap-1.5 rounded-full border", props.className)}
        ref={ref}>
        {children}
      </div>
    )
  }
)

SlightContainer.displayName = "SlightContainer"
