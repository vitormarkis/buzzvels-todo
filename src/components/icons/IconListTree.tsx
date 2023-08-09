import React from "react"
import { IconProps } from "@/types/icon-props"
import { createIconAttributes } from "@/components/icons/createIconAttributes"

export const IconListTree = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconListTreeComponent(props, ref) {
    // const attributes = createIconAttributes(props, { omitFill: true })
    const attributes = createIconAttributes(props)

    return (
      <svg
        {...attributes}
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12h-8" />
        <path d="M21 6H8" />
        <path d="M21 18h-8" />
        <path d="M3 6v4c0 1.1.9 2 2 2h3" />
        <path d="M3 10v6c0 1.1.9 2 2 2h3" />
      </svg>
    )
  }
)
