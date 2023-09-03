import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { IconFolderOpen } from "@/components/icons/IconFolderOpen"
import { IconProps } from "@/types/icon-props"

export type NoTasksPlaceholderProps = React.ComponentPropsWithoutRef<"div"> & {
  children?: React.ReactNode
}

export const NoTasksPlaceholder = React.forwardRef<
  React.ElementRef<"div">,
  NoTasksPlaceholderProps
>(function NoTasksPlaceholderComponent({ children, ...props }, ref) {
  return (
    <div
      {...props}
      className={cn("py-4 flex flex-col gap-2 items-center", props.className)}
      ref={ref}
    >
      <NoTasksPlaceholderText>{children ?? "There is no tasks yet."}</NoTasksPlaceholderText>
      <NoTasksPlaceholderIcon />
    </div>
  )
})

NoTasksPlaceholder.displayName = "NoTasksPlaceholder"

export type NoTasksPlaceholderTextProps = React.ComponentPropsWithoutRef<"h3"> & {
  children: React.ReactNode
}

export const NoTasksPlaceholderText = React.forwardRef<
  React.ElementRef<"h3">,
  NoTasksPlaceholderTextProps
>(function NoTasksPlaceholderTextComponent({ children, ...props }, ref) {
  return (
    <h3
      {...props}
      className={cn("text-center text-color-soft text-xl", props.className)}
      ref={ref}
    >
      {children}
    </h3>
  )
})

NoTasksPlaceholderText.displayName = "NoTasksPlaceholderText"

export type NoTasksPlaceholderIconProps = IconProps & {
  size?: number
} & (
    | {
        asChild: true
        children: React.ReactNode
      }
    | {
        asChild?: false
        children?: never
      }
  )

export const NoTasksPlaceholderIcon = React.forwardRef<
  React.ElementRef<"svg">,
  NoTasksPlaceholderIconProps
>(function NoTasksPlaceholderIconComponent({ size = 80, asChild, children, ...props }, ref) {
  return asChild ? (
    <Slot className={cn("text-color-soft", props.className)}>{children}</Slot>
  ) : (
    <IconFolderOpen
      ref={ref}
      className={cn("text-color-soft", props.className)}
      size={size}
      {...props}
    />
  )
})

NoTasksPlaceholderIcon.displayName = "NoTasksPlaceholderIcon"
