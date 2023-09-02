import React from "react"
import { User } from "@clerk/nextjs/server"
import { cn } from "@/lib/utils"
import { CenteredContainer } from "@/components/container"
import { HeaderActionsSection } from "@/components/molecules/header-actions-section/HeaderActionsSection"
import { HeaderLogoSection } from "@/components/molecules/header-logo-section/HeaderLogoSection"
import { HeaderSheetSection } from "@/components/molecules/header-sheet-section/HeaderSheetSection"

export type HeaderProps = React.ComponentPropsWithoutRef<"header"> & {
  user?: User | null | undefined
}

export const Header = React.forwardRef<React.ElementRef<"header">, HeaderProps>(
  function HeaderComponent({ user, ...props }, ref) {
    return (
      <header
        {...props}
        className={cn("border-b bg-background sticky top-0 z-40", props.className)}
        ref={ref}
      >
        <CenteredContainer className="h-16 flex justify-between gap-4">
          <HeaderSheetSection className="flex-1 md:hidden" />
          <HeaderLogoSection className="flex-1" />
          <HeaderActionsSection
            user={user}
            className="flex-1"
          />
        </CenteredContainer>
      </header>
    )
  }
)

Header.displayName = "Header"
