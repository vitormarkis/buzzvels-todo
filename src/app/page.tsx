import { PopoverThemeSwitcher } from "@/components/theme-switcher/PopoverThemeSwitcher"
import { Button } from "@/components/ui/button"
import { UserButton, currentUser } from "@clerk/nextjs"
import st from "./page.module.css"
import { cn } from "@/lib/utils"

export default async function Home() {
  return (
    <>
      <header className="bg-background">
        <div className="px-8 max-w-7xl mx-auto h-14 flex justify-between">
          <div className="flex items-center">
            <PopoverThemeSwitcher>
              <Button className="__neutral">Tema</Button>
            </PopoverThemeSwitcher>
          </div>
          <div className="flex items-center">
            <UserButton />
          </div>
        </div>
      </header>
      <div className="h-[1px] bg-gradient-to-r from-transparent to-transparent via-color/40 max-w-xl w-full mx-auto -translate-y-[1px]" />
      <div className={cn(st.sponge, "dark:visible invisible")} />
      <main>
        <h1
          className={cn(
            st.heading,
            "font-poppins text-center text-6xl tracking-[2.8px] font-medium"
          )}
        >
          Buzzvel&#8217;s Todo
        </h1>
      </main>
    </>
  )
}
