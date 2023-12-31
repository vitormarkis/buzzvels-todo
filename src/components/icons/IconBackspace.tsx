import React from "react"
import { createIconAttributes } from "@/components/icons/createIconAttributes"
import { IconProps } from "@/types/icon-props"

export const IconBackspace = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconBackspaceComponent(props, ref) {
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
          d="M61.67,204.12,16,128,61.67,51.88A8,8,0,0,1,68.53,48H216a8,8,0,0,1,8,8V200a8,8,0,0,1-8,8H68.53A8,8,0,0,1,61.67,204.12Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={16}
        />
        <line
          x1={160}
          y1={104}
          x2={112}
          y2={152}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={16}
        />
        <line
          x1={160}
          y1={152}
          x2={112}
          y2={104}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={16}
        />
      </svg>
    )
  }
)
