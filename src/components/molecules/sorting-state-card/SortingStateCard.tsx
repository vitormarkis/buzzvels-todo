import React, { useState } from "react"

import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

import { Case } from "@/components/atoms/case/Case"

export type SortingStateCardProps = React.ComponentPropsWithoutRef<"div"> & {
  dateSortingTitle: string
  textSortingTitle: string
  isDoneSortingTitle: string
  notFiltering: boolean
  children: React.ReactNode
}

export const SortingStateCard = React.forwardRef<React.ElementRef<"div">, SortingStateCardProps>(
  function SortingStateCardComponent(
    { notFiltering, dateSortingTitle, isDoneSortingTitle, textSortingTitle, children, ...props },
    ref
  ) {
    const [cardVisible, setCardVisible] = useState(false)

    const Trigger = (props: { children: React.ReactNode }) => (
      <Slot onClick={() => setCardVisible(isOpen => !isOpen)}>{props.children}</Slot>
    )

    return (
      <div
        {...props}
        className={cn("relative", props.className)}
        ref={ref}
      >
        <Trigger>{children}</Trigger>
        <Case condition={cardVisible && notFiltering}>
          <div className="__first whitespace-nowrap bg-background border absolute bottom-[calc(100%_+_0.5rem)] left-1/2 -translate-x-1/2 flex flex-col gap-1 text-xs p-1 rounded-md">
            {dateSortingTitle !== "Not filtering" && (
              <div className="__two h-7 flex items-center px-4 bg-background rounded-sm">
                {dateSortingTitle}
              </div>
            )}
            {isDoneSortingTitle !== "Not filtering" && (
              <div className="__two h-7 flex items-center px-4 bg-background rounded-sm">
                {isDoneSortingTitle}
              </div>
            )}
            {textSortingTitle !== "Not filtering" && (
              <div className="__two h-7 flex items-center px-4 bg-background rounded-sm">
                {textSortingTitle}
              </div>
            )}
          </div>
        </Case>
      </div>
    )
  }
)

SortingStateCard.displayName = "SortingStateCard"
