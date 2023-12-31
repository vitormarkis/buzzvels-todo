import React from "react"
import { createIconAttributes } from "@/components/icons/createIconAttributes"
import { IconProps } from "@/types/icon-props"

export const IconPlus = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconPlusComponent(props, ref) {
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
        <line
          x1={40}
          y1={128}
          x2={216}
          y2={128}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={128}
          y1={40}
          x2={128}
          y2={216}
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
