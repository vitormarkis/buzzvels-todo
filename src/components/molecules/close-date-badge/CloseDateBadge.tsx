import React from "react"

import { cn } from "@/lib/utils"

import { Case } from "@/components/atoms/case/Case"
import { IconCheck } from "@/components/icons"
import { IconWarning } from "@/components/icons/IconWarning"
import { IconWarningSeal } from "@/components/icons/IconWarningSeal"

import { IconProps } from "@/types/icon-props"

// {
//   // "bg-background-shadow": closeDate === "past",
//   "bg-[#f53e3e]": !isDone && closeDate === "one-day",
//   "bg-[#ffea55] text-black": !isDone && closeDate === "two-days",
//   "bg-[#48ad1b]": isDone,
// },

export type CloseDateBadgeProps = React.ComponentPropsWithoutRef<"div"> &
  GetCloseDate & {
    isDone?: boolean
  }

export const CloseDateBadge = React.forwardRef<React.ElementRef<"div">, CloseDateBadgeProps>(
  function CloseDateBadgeComponent({ isDone, closeDate, shouldShow, ...props }, ref) {
    return shouldShow ? (
      <div
        {...props}
        className={cn("__first", props.className)}
        ref={ref}>
        <Case condition={isDone}>
          <CloseDateBadgeContent
            palette="__positive"
            icon={<IconCheck size={12} />}>
            Task done at time.
          </CloseDateBadgeContent>
        </Case>
        <Case condition={!isDone}>
          <Case condition={closeDate === "one-day"}>
            <CloseDateBadgeContent
              palette="__block"
              icon={<IconWarningSeal size={12} />}>
              One day remaining to finish the task.
            </CloseDateBadgeContent>
          </Case>
          <Case condition={closeDate === "two-days"}>
            <CloseDateBadgeContent
              palette="__warn"
              icon={<IconWarning size={12} />}>
              Two days remaining to finish the task.
            </CloseDateBadgeContent>
          </Case>
        </Case>
      </div>
    ) : null
  }
)

CloseDateBadge.displayName = "CloseDateBadge"

export type CloseDate = "one-day" | "two-days" | "past" | null
export interface GetCloseDate {
  closeDate: CloseDate
  shouldShow: boolean
}

export function getCloseDate(date: number | null, isDone?: boolean): GetCloseDate {
  if (!date) return { closeDate: null, shouldShow: false }

  const now = new Date().getTime()
  const oneDayDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1).getTime()
  const twoDayDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2).getTime()

  if (now > date) return { closeDate: "past", shouldShow: false }
  if (oneDayDate > date) return { closeDate: "one-day", shouldShow: true }
  if (twoDayDate > date) return { closeDate: "two-days", shouldShow: true }
  return { closeDate: null, shouldShow: false }
}

export type CloseDateBadgeContentProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
  icon: React.ReactNode
  palette: "__warn" | "__positive" | "__block"
}

export const CloseDateBadgeContent = React.forwardRef<
  React.ElementRef<"div">,
  CloseDateBadgeContentProps
>(function CloseDateBadgeContentComponent({ palette, icon, children, ...props }, ref) {
  return (
    <div
      {...props}
      className={cn("flex items-center relative", props.className)}
      ref={ref}>
      <div
        className={cn(
          "h-5 w-5 shrink-0 z-10 grid place-items-center rounded-md bg-background border-heading/20",
          palette
        )}>
        {icon}
      </div>
      <div className="-translate-x-[0.5rem] pl-3 leading-none py-0.5 px-2 text-xs text-color bg-background border truncate rounded-md">
        <span>{children}</span>
      </div>
    </div>
  )
})

CloseDateBadgeContent.displayName = "CloseDateBadgeContent"
