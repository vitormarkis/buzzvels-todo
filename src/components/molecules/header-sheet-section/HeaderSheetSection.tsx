import React from "react"
import { cn } from "@/lib/utils"
import { IconList } from "@/components/icons/IconList"
import { SidebarMenu } from "@/components/organisms/sidebar-menu/SidebarMenu"
import { Button } from "@/components/ui/button"

export type HeaderSheetSectionProps = React.ComponentPropsWithoutRef<"div"> & {}

export const HeaderSheetSection = React.forwardRef<
  React.ElementRef<"div">,
  HeaderSheetSectionProps
>(function HeaderSheetSectionComponent({ ...props }, ref) {
  return (
    <div
      {...props}
      className={cn("flex items-center", props.className)}
      ref={ref}
    >
      <SidebarMenu>
        <Button className="h-8 w-8 p-0">
          <IconList />
        </Button>
      </SidebarMenu>
    </div>
  )
})

HeaderSheetSection.displayName = "HeaderSheetSection"
