import React from "react"
import { cn } from "@/lib/utils"

export type PadWrapperProps = React.ComponentPropsWithoutRef<"section"> & {
  children: React.ReactNode
}

export const PadWrapper = React.forwardRef<React.ElementRef<"section">, PadWrapperProps>(
  function PadWrapperComponent({ children, ...props }, ref) {
    return (
      <section
        {...props}
        className={cn("bg-background rounded-xl flex flex-col p-2 gap-2", props.className)}
        ref={ref}
      >
        {children}
      </section>
    )
  }
)

PadWrapper.displayName = "PadWrapper"
