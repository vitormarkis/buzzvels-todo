import React from "react"

import { createIconAttributes } from "@/components/icons/createIconAttributes"

import { IconProps } from "@/types/icon-props"

export const IconSun = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconSunComponent(props, ref) {
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
        <line
          x1={128}
          y1={32}
          x2={128}
          y2={16}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <circle
          cx={128}
          cy={128}
          r={56}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={60}
          y1={60}
          x2={48}
          y2={48}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={60}
          y1={196}
          x2={48}
          y2={208}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={196}
          y1={60}
          x2={208}
          y2={48}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={196}
          y1={196}
          x2={208}
          y2={208}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={32}
          y1={128}
          x2={16}
          y2={128}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={128}
          y1={224}
          x2={128}
          y2={240}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <line
          x1={224}
          y1={128}
          x2={240}
          y2={128}
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
