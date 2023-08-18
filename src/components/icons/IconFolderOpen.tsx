import React from "react"

import { createIconAttributes } from "@/components/icons/createIconAttributes"

import { IconProps } from "@/types/icon-props"

export const IconFolderOpen = React.forwardRef<React.ElementRef<"svg">, IconProps>(
  function IconFolderOpenComponent(props, ref) {
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
        <path
          d="M32,208V64a8,8,0,0,1,8-8H93.33a8,8,0,0,1,4.8,1.6l27.74,20.8a8,8,0,0,0,4.8,1.6H200a8,8,0,0,1,8,8v28"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={24}
        />
        <path
          d="M32,208l30.18-86.53A8,8,0,0,1,69.77,116H232a8,8,0,0,1,7.59,10.53L211.09,208Z"
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
