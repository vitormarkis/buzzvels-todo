import React, { createContext, useContext } from "react"
import { CheckedState } from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"
import { EditableLabel, EditableLabelProps } from "@/components/editable-label/EditableLabel"
import { IconX } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Checkbox, CheckboxProps } from "@/components/ui/checkbox"

export type TodoContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const TodoContainer = React.forwardRef<React.ElementRef<"div">, TodoContainerProps>(
  function TodoContainerComponent({ children, ...props }, ref) {
    return (
      <div
        {...props}
        className={cn("flex items-center px-2 gap-1.5", props.className)}
        ref={ref}
      >
        {children}
      </div>
    )
  }
)

TodoContainer.displayName = "TodoContainer"

export const TodoEditableLabel = React.forwardRef<
  React.ElementRef<typeof EditableLabel>,
  Omit<React.ComponentPropsWithoutRef<typeof EditableLabel>, "state" | "onAction">
>(function TodoEditableLabelComponent({ children, className, ...props }, ref) {
  const { text, setText, checked, onLabelChange } = useContext(TodoContext)

  return (
    <EditableLabel
      {...props}
      className={cn("grow", className)}
      ref={ref}
      state={[text, setText]}
      isCompleted={!!checked}
      onAction={onLabelChange}
    />
  )
})

TodoEditableLabel.displayName = "TodoEditableLabel"

export const TodoCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  React.ComponentPropsWithoutRef<typeof Checkbox>
>(function TodoCheckboxComponent({ children, ...props }, ref) {
  const { checked, onCheckedChange } = useContext(TodoContext)

  const handleOnCheckedChange = (checked: CheckedState) => {
    if (checked === "indeterminate") if (onCheckedChange) return onCheckedChange(false)
    if (onCheckedChange) onCheckedChange(checked)
  }

  return (
    <Checkbox
      {...props}
      className={cn("", props.className)}
      ref={ref}
      checked={checked}
      onCheckedChange={handleOnCheckedChange}
    />
  )
})

TodoCheckbox.displayName = "TodoCheckbox"

export type TodoActionsContainerProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const TodoActionsContainer = React.forwardRef<
  React.ElementRef<"div">,
  TodoActionsContainerProps
>(function TodoActionsContainerComponent({ children, ...props }, ref) {
  return (
    <div
      {...props}
      className={cn("flex items-center", props.className)}
      ref={ref}
    >
      {children}
    </div>
  )
})

TodoActionsContainer.displayName = "TodoActionsContainer"

export type TodoActionProps = React.ComponentPropsWithoutRef<"button"> & {
  children: React.ReactNode
}

export const TodoAction = React.forwardRef<React.ElementRef<"button">, TodoActionProps>(
  function TodoActionComponent({ children, ...props }, ref) {
    const { onLabelChange, text } = useContext(TodoContext)
    const shouldDisable = !props.onClick && text.length === 0

    return (
      <button
        data-disabled={shouldDisable}
        disabled={shouldDisable}
        {...props}
        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          if (props.onClick) return props.onClick(event)
          onLabelChange(text)
        }}
        className={cn(
          "disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background-shadow h-6 w-6 grid place-items-center rounded-md transition",
          props.className
        )}
        ref={ref}
      >
        {children}
      </button>
    )
  }
)

TodoAction.displayName = "TodoAction"
export type ITodoContext = TodoProviderProps & {
  text: string
  setText: React.Dispatch<React.SetStateAction<string>>
}

type TodoProviderProps = {
  checked?: CheckboxProps["checked"]
  onCheckedChange: CheckboxProps["onCheckedChange"]
  initialLabelValue: string
  onLabelChange: EditableLabelProps["onAction"]
}

const TodoContext = createContext({} as ITodoContext)

export function TodoProvider(
  props: TodoProviderProps & {
    children: React.ReactNode
  }
) {
  const { initialLabelValue, onCheckedChange, checked, onLabelChange } = props
  const [text, setText] = React.useState(initialLabelValue)

  return (
    <TodoContext.Provider
      value={{
        text,
        setText,
        initialLabelValue,
        onCheckedChange,
        checked,
        onLabelChange,
      }}
    >
      {props.children}
    </TodoContext.Provider>
  )
}
