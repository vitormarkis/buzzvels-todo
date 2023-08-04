"use client"
import { PopoverThemeSwitcher } from "@/components/theme-switcher/PopoverThemeSwitcher"
import { Button } from "@/components/ui/button"
import { UserButton, currentUser } from "@clerk/nextjs"
import st from "./page.module.css"
import { cn } from "@/lib/utils"
import { IconMoon, IconPlus, IconSun } from "@/components/icons"
import { useTodosGroup } from "@/contexts/todos-group/todosGroupContext"

export default function Home() {
  const { todoGroups, usingTodoGroup, setUsingTodoGroup } = useTodosGroup()

  return (
    <>
      <header className="border-b bg-background">
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
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[1px] h-[1px] bg-gradient-to-r from-transparent to-transparent via-color/40 max-w-xl w-full" />
      <div className={cn(st.sponge, "dark:visible invisible")} />
      <div className="container flex h-[calc(100dvh_-_58px)]">
        <aside className="flex h-full max-h-screen w-[200px] border-r">
          <div className="flex flex-col w-full">
            {todoGroups.map(group => (
              <button
                className={cn(
                  "h-8 text-sm flex items-center px-4 hover:bg-background-shadow border-l hover:border-color transition",
                  group.name === usingTodoGroup &&
                    "__two bg-background border-l-accent hover:border-l-accent"
                )}
                onClick={() => setUsingTodoGroup(group.name)}
              >
                {group.label}
              </button>
            ))}
          </div>
        </aside>
        <main className="flex-1 py-12">
          <Button
            size="xl"
            className="__neutral mx-auto"
          >
            <IconPlus size={16} />
            New task
          </Button>
        </main>
      </div>
    </>
  )
}
