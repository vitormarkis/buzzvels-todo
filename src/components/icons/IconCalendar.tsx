import React from "react"
import { createIconAttributes } from "@/components/icons/createIconAttributes"
import { IconProps } from "@/types/icon-props"

export const IconCalendar = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconCalendarComponent(props, ref) {
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
        <rect
          x={40}
          y={40}
          width={176}
          height={176}
          rx={8}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={176}
          y1={24}
          x2={176}
          y2={52}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={80}
          y1={24}
          x2={80}
          y2={52}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={40}
          y1={88}
          x2={216}
          y2={88}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <polyline
          points="84 132 100 124 100 180"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <path
          d="M138.14,132a16,16,0,1,1,26.64,17.63L136,180h32"
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
