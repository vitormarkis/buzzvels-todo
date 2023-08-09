import React from "react"

export interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number
}

export interface IconOptions {
  omitFill?: boolean
}
