import { cn } from "@/lib/utils"
import { IconProps } from "@/types/icon-props"
import { cssVariables } from "@/utils/units/cssVariables"

export const createIconAttributes = ({ className, style, size = 18, ...props }: IconProps) => {
  const sizeInRem = String(size / 16).slice(0, 5)

  return {
    ...props,
    className: cn("h-[var(--iconSize)] w-[var(--iconSize)] text-symbol", className),
    style: cssVariables(["iconSize", sizeInRem, "rem"], style),
  }
}
