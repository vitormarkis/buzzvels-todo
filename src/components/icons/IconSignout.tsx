import React from "react"
import { createIconAttributes } from "@/components/icons/createIconAttributes"
import { IconProps } from "@/types/icon-props"

export const IconSignout = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconSignoutComponent(props, ref) {
    const attributes = createIconAttributes(props)

    return (
      <svg
        {...attributes}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        ref={ref}
      >
        <rect
          width={256}
          height={256}
          fill="none"
        />
        <path
          d="M104,40H48a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8h56"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={104}
          y1={128}
          x2={216}
          y2={128}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <polyline
          points="176 88 216 128 176 168"
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
