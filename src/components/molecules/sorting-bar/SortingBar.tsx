import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { SortingStateCard } from "@/components/molecules/sorting-state-card/SortingStateCard"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SortDate, SortIsDone, SortText, useTasksListState } from "@/hooks/useTasksListState"

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

const isDoneSortingTitles: Record<NonNullable<SortIsDone> | "default", string> = {
  "isDone-asc": "To do first",
  "isDone-desc": "Done first",
  default: "Not filtering",
}

export const SortingBar = React.forwardRef<React.ElementRef<"div">, SortingBarProps>(
  function SortingBarComponent({ ...props }, ref) {
    const [isSortingPopoverOpen, setIsSortingPopoverOpen] = useState(false)
    const { toggleSort, sortCurrent } = useTasksListState()
    const { date, text, isDone } = sortCurrent

    const dateSortingTitle = dateSortingTitles[date ?? "default"]
    const textSortingTitle = textSortingTitles[text ?? "default"]
    const isDoneSortingTitle = isDoneSortingTitles[isDone ?? "default"]

    const notFiltering = ![dateSortingTitle, isDoneSortingTitle, textSortingTitle].every(
      s => s === "Not filtering"
    )

    return (
      <div
        {...props}
        className={cn("flex px-4", props.className)}
        ref={ref}
      >
        <div className="grow py-1.5">
          <h2 className="text-lg font-medium text-heading">Your To-do's</h2>
        </div>
        <div className="flex items-center gap-2">
          <SortingStateCard
            dateSortingTitle={dateSortingTitle}
            textSortingTitle={textSortingTitle}
            isDoneSortingTitle={isDoneSortingTitle}
            notFiltering={notFiltering}
          >
            <button
              data-sorting={notFiltering}
              className="grid place-items-center text-xs border border-transparent bg-special-slate px-2 h-6 rounded-lg cursor-default"
            >
              <span>Sorting:</span>
            </button>
          </SortingStateCard>

          <div className="flex items-center gap-2">
            <button
              title={dateSortingTitle}
              data-active={!!date}
              className={cn(
                "__first text-xs bg-transparent h-6 px-2 rounded-lg text-color-soft transition",
                "data-[active=true]:bg-background hover:text-color-strong"
              )}
              onClick={() => toggleSort("date")}
            >
              <span>Date</span>
            </button>
            <button
              title={textSortingTitle}
              data-active={!!text}
              className={cn(
                "__first text-xs bg-transparent h-6 px-2 rounded-lg text-color-soft transition",
                "data-[active=true]:bg-background hover:text-color-strong"
              )}
              onClick={() => toggleSort("text")}
            >
              <span>Text</span>
            </button>
            <button
              title={isDoneSortingTitle}
              data-active={!!isDone}
              className={cn(
                "__first text-xs bg-transparent h-6 px-2 rounded-lg text-color-soft transition",
                "data-[active=true]:bg-background hover:text-color-strong"
              )}
              onClick={() => toggleSort("isDone")}
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
)

SortingBar.displayName = "SortingBar"
