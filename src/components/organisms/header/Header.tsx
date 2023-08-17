import { CenteredContainer, SlightContainer } from "@/components/container"
import { IconMoon, IconSignout, IconSun } from "@/components/icons"
import { IconList } from "@/components/icons/IconList"
import { Sidebar } from "@/components/organisms"
import { PopoverThemeSwitcher } from "@/components/theme-switcher/PopoverThemeSwitcher"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useClerk } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/server"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import st from "./Header.module.css"

export type HeaderProps = React.ComponentPropsWithoutRef<"header"> & {
  user?: User | null | undefined
}

export const Header = React.forwardRef<React.ElementRef<"header">, HeaderProps>(
  function HeaderComponent({ user, ...props }, ref) {
    const { signOut } = useClerk()
    const router = useRouter()
    const isSignedIn = !!user

    return (
      <header
        {...props}
        className={cn("border-b bg-background sticky top-0 z-30", props.className)}
        ref={ref}
      >
        <CenteredContainer className="h-16 flex justify-between gap-4">
          <div className="flex-1 md:hidden flex items-center">
            <Sheet>
              <SheetTrigger>
                <Button className="h-8 w-8 p-0">
                  <IconList />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="space-y-2"
              >
                <div>
                  <h3 className="mb-0.5 text-heading text-xl font-medium">Navigation</h3>
                  <p className="text-heading-sub text-sm">The group of to-do's you have.</p>
                </div>
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex-1 flex items-center justify-center md:justify-start whitespace-nowrap">
            <span
              className={cn(
                st.heading,
                "font-poppins text-center text-xl xs:text-2xl tracking-wider font-medium"
              )}
            >
              Buzzvel&#8217;s Todo
            </span>
          </div>
          <div className="flex-1 flex items-center justify-end">
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
                      <AvatarFallback>{`
                        ${user.firstName?.charAt(0).toUpperCase()}${user.lastName
                        ?.charAt(0)
                        .toUpperCase()}
                        `}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                    {/* <DropdownMenuSeparator /> */}
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
              {/* <UserButton afterSignOutUrl="/" /> */}
            </SlightContainer>
          </div>
        </CenteredContainer>
      </header>
    )
  }
)

Header.displayName = "Header"
