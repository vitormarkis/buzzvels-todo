import React from "react"

import { cn } from "@/lib/utils"

import { SortDate, SortText, useTasksListState } from "@/hooks/useTasksListState"

export type SortingBarProps = React.ComponentPropsWithoutRef<"div"> & {}

const dateSortingTitles: Record<NonNullable<SortDate> | "default", string> = {
  "createdAt-asc": "Created at (asc)",
  "createdAt-desc": "Created at (desc)",
  "expiresAt-asc": "Expires at (asc)",
  "expiresAt-desc": "Expires at (desc)",
  default: "Not filtering",
}

const textSortingTitles: Record<NonNullable<SortText> | "default", string> = {
  "text-asc": "Text (asc)",
  "text-desc": "Text (desc)",
  default: "Not filtering",
}

export const SortingBar = React.forwardRef<React.ElementRef<"div">, SortingBarProps>(
  function SortingBarComponent({ ...props }, ref) {
    const { toggleSort, sortCurrent } = useTasksListState()
    const { date, text } = sortCurrent

    const dateSortingTitle = dateSortingTitles[date ?? "default"]
    const textSortingTitle = textSortingTitles[text ?? "default"]

    return (
      <div
        {...props}
        className={cn("flex px-4", props.className)}
        ref={ref}>
        <div className="grow py-1.5">
          <h2 className="text-lg font-medium text-heading">Your To-do's</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="grid place-items-center text-xs border border-transparent bg-special-slate px-2 h-6 rounded-lg cursor-default">
            <span>Sorting:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              title={dateSortingTitle}
              data-active={!!date}
              className={cn(
                "__first text-xs bg-transparent h-6 px-2 rounded-lg text-color-soft transition",
                "data-[active=true]:bg-background hover:text-color-strong"
              )}
              onClick={() => toggleSort("date")}>
              <span>Date</span>
            </button>
            <button
              title={textSortingTitle}
              data-active={!!text}
              className={cn(
                "__first text-xs bg-transparent h-6 px-2 rounded-lg text-color-soft transition",
                "data-[active=true]:bg-background hover:text-color-strong"
              )}
              onClick={() => toggleSort("text")}>
              <span>Text</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
)

SortingBar.displayName = "SortingBar"
