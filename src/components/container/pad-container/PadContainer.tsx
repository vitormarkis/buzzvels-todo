import React from "react"

import { cn } from "@/lib/utils"

export type PadContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const PadContainer = React.forwardRef<React.ElementRef<"div">, PadContainerProps>(
  function PadContainerComponent({ children, ...props }, ref) {
    return (
      <div
        {...props}
        className={cn(
          "flex items-center gap-3 px-6 rounded-[0.625rem] bg-background text-color-strong",
          props.className
        )}
        ref={ref}>
        {children}
      </div>
    )
  }
)

PadContainer.displayName = "PadContainer"
