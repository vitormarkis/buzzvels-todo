import React, { useState } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { SortingStateCard } from "@/components/molecules/sorting-state-card/SortingStateCard"
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
        <HeadingTaskListSection>
          <h2>Your To-do's</h2>
        </HeadingTaskListSection>
        <div className="flex items-center gap-2">
          <SortingStateCard
            dateSortingTitle={dateSortingTitle}
            textSortingTitle={textSortingTitle}
            isDoneSortingTitle={isDoneSortingTitle}
            notFiltering={notFiltering}
          >
            <button
              data-sorting={notFiltering}
              className="grid place-items-center text-xs border border-transparent bg-special-slate px-2 h-6 rounded-lg"
            >
              <span>Sorting:</span>
            </button>
          </SortingStateCard>

          <div className="flex items-center gap-2">
            <ButtonSecondary
              title={dateSortingTitle}
              data-active={!!date}
              onClick={() => toggleSort("date")}
            >
              <span>Date</span>
            </ButtonSecondary>
            <ButtonSecondary
              title={textSortingTitle}
              data-active={!!text}
              onClick={() => toggleSort("text")}
            >
              <span>Text</span>
            </ButtonSecondary>
            <ButtonSecondary
              title={isDoneSortingTitle}
              data-active={!!isDone}
              onClick={() => toggleSort("isDone")}
            >
              <span>Done</span>
            </ButtonSecondary>
          </div>
        </div>
      </div>
    )
  }
)

SortingBar.displayName = "SortingBar"

export type ButtonSecondaryProps = React.ComponentPropsWithoutRef<"button"> & {
  children: React.ReactNode
}

export const ButtonSecondary = React.forwardRef<React.ElementRef<"button">, ButtonSecondaryProps>(
  function ButtonSecondaryComponent({ children, ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        className={cn(
          "__first text-xs bg-transparent h-6 px-2 rounded-lg text-color-soft transition",
          "data-[active=true]:bg-background hover:text-color-strong",
          props.className
        )}
      >
        {children}
      </button>
    )
  }
)

ButtonSecondary.displayName = "ButtonSecondary"

export type HeadingTaskListSectionProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const HeadingTaskListSection = React.forwardRef<
  React.ElementRef<"div">,
  HeadingTaskListSectionProps
>(function HeadingTaskListSectionComponent({ children, ...props }, ref) {
  return (
    <div
      {...props}
      className={cn("grow py-1.5", props.className)}
      ref={ref}
    >
      <Slot className="text-lg font-medium text-heading">{children}</Slot>
    </div>
  )
})

HeadingTaskListSection.displayName = "HeadingTaskListSection"
