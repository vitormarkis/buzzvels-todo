import React from "react"
import { createIconAttributes } from "@/components/icons/createIconAttributes"
import { IconProps } from "@/types/icon-props"

export const IconThreeDotsVertical = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconThreeDotsVerticalComponent(props, ref) {
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
        <circle
          cx={128}
          cy={60}
          r={16}
        />
        <circle
          cx={128}
          cy={128}
          r={16}
        />
        <circle
          cx={128}
          cy={196}
          r={16}
        />
      </svg>
    )
  }
)
