import Link from "next/link"
import React from "react"
import { User } from "@clerk/nextjs/server"
import { cn } from "@/lib/utils"
import { Case } from "@/components/atoms/case/Case"
import { SlightContainer } from "@/components/container"
import { IconMoon, IconSun } from "@/components/icons"
import { HeaderOptionsDropdown } from "@/components/molecules/dropdown-options-header/HeaderOptionsDropdown"
import { PopoverThemeSwitcher } from "@/components/theme-switcher/PopoverThemeSwitcher"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export type HeaderActionsSectionProps = React.ComponentPropsWithoutRef<"div"> & {
  user?: User | null | undefined
}

export const HeaderActionsSection = React.forwardRef<
  React.ElementRef<"div">,
  HeaderActionsSectionProps
>(function HeaderActionsSectionComponent({ user, ...props }, ref) {
  const isSignedIn = !!user

  const usernameFallback = user
    ? `
  ${user.firstName?.charAt(0).toUpperCase()}${user.lastName?.charAt(0).toUpperCase()}
  `
    : "NA"

  return (
    <div
      {...props}
      className={cn("flex items-center justify-end", props.className)}
      ref={ref}
    >
      <SlightContainer>
        <PopoverThemeSwitcher>
          <Button className="h-10 w-10 rounded-full p-0">
            <IconSun className="block dark:hidden" />
            <IconMoon className="hidden dark:block" />
          </Button>
        </PopoverThemeSwitcher>
        <Case condition={isSignedIn}>
          <HeaderOptionsDropdown>
            <Avatar>
              <AvatarImage src={user!.imageUrl} />
              <AvatarFallback>{usernameFallback}</AvatarFallback>
            </Avatar>
          </HeaderOptionsDropdown>
        </Case>
        <Case condition={!isSignedIn}>
          <Button
            asChild
            className="__action rounded-full whitespace-nowrap"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </Case>
      </SlightContainer>
    </div>
  )
})

HeaderActionsSection.displayName = "HeaderActionsSection"
