import React from "react"

export type CaseProps = {
  condition?: boolean
  children: React.ReactNode
}

export function Case({ condition, children }: CaseProps) {
  return condition ? children : null
}
