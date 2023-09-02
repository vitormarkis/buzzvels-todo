import React from "react"
import { cn } from "@/lib/utils"
import { SidebarContent } from "@/components/organisms"

export type SidebarProps = React.ComponentPropsWithoutRef<"aside"> & {}

export const Sidebar = React.forwardRef<React.ElementRef<"aside">, SidebarProps>(
  function SidebarComponent({ ...props }, ref) {
    return (
      <aside
        {...props}
        className={cn(" max-h-screen w-[200px] border-r sticky top-[65px]", props.className)}
        ref={ref}
      >
        <SidebarContent />
      </aside>
    )
  }
)

Sidebar.displayName = "Sidebar"
