import React from "react"
import { IconProps } from "@/types/icon-props"
import { createIconAttributes } from "@/components/icons/createIconAttributes"

export const IconList = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconListComponent(props, ref) {
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
          x1={40}
          y1={64}
          x2={216}
          y2={64}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={40}
          y1={192}
          x2={216}
          y2={192}
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
