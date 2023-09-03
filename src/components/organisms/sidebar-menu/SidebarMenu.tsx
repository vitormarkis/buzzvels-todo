import React from "react"
import { cn } from "@/lib/utils"
import { SidebarContent } from "@/components/organisms"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export type SidebarMenuProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const SidebarMenu = React.forwardRef<React.ElementRef<"div">, SidebarMenuProps>(
  function SidebarMenuComponent({ children, ...props }, ref) {
    return (
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent
          {...props}
          side="left"
          className={cn("space-y-2", props.className)}
          ref={ref}
        >
          <div>
            <h3 className="mb-0.5 text-heading text-xl font-medium">Navigation</h3>
            <p className="text-heading-sub text-sm">The group of to-do's you have.</p>
          </div>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }
)

SidebarMenu.displayName = "SidebarMenu"
