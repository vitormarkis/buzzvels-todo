"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function Home() {
  const { setTheme, theme } = useTheme()

  const handleSwitchTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light")
  }

  return <Button onClick={handleSwitchTheme}>Mudar tema</Button>
}
