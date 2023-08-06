"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  "peer bg-background shrink-0 rounded-md border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-background-shadow data-[state=checked]:text-color-strong",
  {
    variants: {
      size: {
        default: "h-5 w-5",
        big: "h-7 w-7",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const checkboxIconVariants = cva("", {
  variants: {
    size: {
      default: "h-3 w-3",
      big: "h-4, w-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants> & {}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, size, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(checkboxVariants({ size, className }))}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-color-strong")}
      >
        <Check className={checkboxIconVariants({ size })} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
