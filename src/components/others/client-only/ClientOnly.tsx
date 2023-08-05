import React from "react"

export type ClientOnlyProps = {
  children: React.ReactNode
}

export function ClientOnly({ children }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = React.useState(false)

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted ? children : null
}
