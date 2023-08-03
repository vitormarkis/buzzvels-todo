import { cn } from "@/lib/utils"
import { IconProps } from "@/types/icon-props"
import { cssVariables } from "@/utils/units/cssVariables"

export const createIconAttributes = ({ className, style, size = 18, ...props }: IconProps) => {
  return {
    ...props,
    className: cn("h-[var(--iconSize)] w-[var(--iconSize)]", className),
    style: cssVariables(["iconSize", size, "px"], style),
  }
}
