import React from "react"
import { IconProps } from "@/types/icon-props"
import { createIconAttributes } from "@/components/icons/createIconAttributes"

export const IconX = React.forwardRef<React.ElementRef<"svg">, IconProps>(function IconXComponent(
  props,
  ref
) {
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
        x1={200}
        y1={56}
        x2={56}
        y2={200}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={24}
      />
      <line
        x1={200}
        y1={200}
        x2={56}
        y2={56}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={24}
      />
    </svg>
  )
})
