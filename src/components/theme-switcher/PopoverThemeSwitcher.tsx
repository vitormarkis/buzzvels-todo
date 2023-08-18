import { useTheme } from "next-themes"
import React from "react"

import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export type PopoverThemeSwitcherProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const PopoverThemeSwitcher = React.forwardRef<
  React.ElementRef<"div">,
  PopoverThemeSwitcherProps
>(function PopoverThemeSwitcherComponent({ children, ...props }, ref) {
  const { setTheme, theme } = useTheme()

  const toggleTheme = (newTheme: string) => () => {
    if (theme === newTheme) return
    setTheme(newTheme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        {...props}
        className={cn("", props.className)}
        ref={ref}>
        <DropdownMenuItem onClick={toggleTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme("dark")}>Dark</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
