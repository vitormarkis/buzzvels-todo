import { PopoverThemeSwitcher } from "@/components/theme-switcher/PopoverThemeSwitcher"
import { Button } from "@/components/ui/button"
import { UserButton, currentUser } from "@clerk/nextjs"
import st from "./page.module.css"
import { cn } from "@/lib/utils"
import { IconMoon, IconPlus, IconSun } from "@/components/icons"
import { useTheme } from "next-themes"

export default async function Home() {
  return (
    <>
      <header className="bg-background">
        <div className="container h-14 flex justify-between">
          <div className="flex items-center">
            <span
              className={cn(
                st.heading,
                "font-poppins text-center text-2xl tracking-wider font-medium"
              )}
            >
              Buzzvel&#8217;s Todo
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex p-1.5 gap-1.5 rounded-full border">
              <PopoverThemeSwitcher>
                <Button className="h-8 w-8 rounded-full p-0">
                  <IconSun className="block dark:hidden" />
                  <IconMoon className="hidden dark:block" />
                </Button>
              </PopoverThemeSwitcher>
              <UserButton />
            </div>
          </div>
        </div>
      </header>
      <div className="h-[1px] bg-gradient-to-r from-transparent to-transparent via-color/40 max-w-xl w-full mx-auto -translate-y-[1px]" />
      <div className={cn(st.sponge, "dark:visible invisible")} />
      <main className="py-12">
        <div className="container">
          <Button
            size="xl"
            className="__neutral mx-auto"
          >
            <IconPlus size={16} />
            New task
          </Button>
        </div>
      </main>
    </>
  )
}
