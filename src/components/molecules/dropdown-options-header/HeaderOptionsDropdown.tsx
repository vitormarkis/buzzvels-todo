import { useRouter } from "next/router"
import React from "react"
import { useClerk } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { IconSignout } from "@/components/icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type HeaderOptionsDropdownProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const HeaderOptionsDropdown = React.forwardRef<
  React.ElementRef<"div">,
  HeaderOptionsDropdownProps
>(function HeaderOptionsDropdownComponent({ children, ...props }, ref) {
  const router = useRouter()
  const { signOut } = useClerk()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        {...props}
        className={cn("", props.className)}
        ref={ref}
      >
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
  )
})

HeaderOptionsDropdown.displayName = "HeaderOptionsDropdown"
