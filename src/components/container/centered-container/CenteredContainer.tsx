import React from "react"

import { cn } from "@/lib/utils"

export type CenteredContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const CenteredContainer = React.forwardRef<React.ElementRef<"div">, CenteredContainerProps>(
  function CenteredContainerComponent({ children, ...props }, ref) {
    return (
      <div
        {...props}
        className={cn("max-w-7xl mx-auto px-4 md:px-8", props.className)}
        ref={ref}>
        {children}
      </div>
    )
  }
)

CenteredContainer.displayName = "CenteredContainer"
