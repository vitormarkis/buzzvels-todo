import { useEffect } from "react"

type ScrollPosition = {
  range: [start: number, end: number]
}

export function useScrollPosition(
  onRange: (isAtRange: boolean) => void,
  options: ScrollPosition = {
    range: [0, Infinity],
  }
) {
  const [minRange, maxRange] = options.range

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY >= minRange && window.scrollY <= maxRange) {
        onRange(true)
      } else {
        onRange(false)
      }
    }

    window.addEventListener("scroll", scrollListener)

    return () => window.removeEventListener("scroll", scrollListener)
  }, [])
}
