import { PopoverThemeSwitcher } from "@/components/theme-switcher/PopoverThemeSwitcher"
import { Button } from "@/components/ui/button"
import { UserButton, currentUser } from "@clerk/nextjs"

export default async function Home() {
  return (
    <>
      <header className="border-b">
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
    </>
  )
}
