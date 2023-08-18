import React from "react"

import { createIconAttributes } from "@/components/icons/createIconAttributes"

import { IconProps } from "@/types/icon-props"

export const IconClipboard = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconClipboardComponent(props, ref) {
    const attributes = createIconAttributes(props)

    return (
      <svg
        {...attributes}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        ref={ref}>
        <rect
          width={256}
          height={256}
          fill="none"
        />
        <polyline
          points="168 168 216 168 216 40 88 40 88 88"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <rect
          x={40}
          y={88}
          width={128}
          height={128}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
      </svg>
    )
  }
)
