import React from "react"
import { cn } from "@/lib/utils"
import st from "@/components/organisms/header/Header.module.css"

export type HeaderLogoSectionProps = React.ComponentPropsWithoutRef<"div"> & {}

export const HeaderLogoSection = React.forwardRef<React.ElementRef<"div">, HeaderLogoSectionProps>(
  function HeaderLogoSectionComponent({ ...props }, ref) {
    return (
      <div
        {...props}
        className={cn(
          "flex items-center justify-center md:justify-start whitespace-nowrap",
          props.className
        )}
        ref={ref}
      >
        <span
          className={cn(
            st.heading,
            "font-poppins text-center text-xl xs:text-2xl tracking-wider font-medium"
          )}
        >
          Buzzvel&#8217;s Todo
        </span>
      </div>
    )
  }
)

HeaderLogoSection.displayName = "HeaderLogoSection"
