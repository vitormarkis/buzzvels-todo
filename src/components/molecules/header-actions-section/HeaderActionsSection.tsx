import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useClerk } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/server"
import { cn } from "@/lib/utils"
import { SlightContainer } from "@/components/container"
import { IconMoon, IconSignout, IconSun } from "@/components/icons"
import { PopoverThemeSwitcher } from "@/components/theme-switcher/PopoverThemeSwitcher"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type HeaderActionsSectionProps = React.ComponentPropsWithoutRef<"div"> & {
  user?: User | null | undefined
}

export const HeaderActionsSection = React.forwardRef<
  React.ElementRef<"div">,
  HeaderActionsSectionProps
>(function HeaderActionsSectionComponent({ user, ...props }, ref) {
  const isSignedIn = !!user
  const router = useRouter()
  const { signOut } = useClerk()

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
        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user.imageUrl} />
                <AvatarFallback>{usernameFallback}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  router.push("/sign-in")
                  void signOut()
                }}
              >
                <IconSignout
                  size={16}
                  style={{ color: "inherit" }}
                />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            className="__action rounded-full whitespace-nowrap"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
        )}
      </SlightContainer>
    </div>
  )
})

HeaderActionsSection.displayName = "HeaderActionsSection"
