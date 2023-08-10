import React, { createContext, useContext } from "react"
import { cn } from "@/lib/utils"
import { Checkbox, CheckboxProps } from "@/components/ui/checkbox"
import { EditableLabel, EditableLabelProps } from "@/components/editable-label/EditableLabel"
import { CheckedState } from "@radix-ui/react-checkbox"

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
>(function TodoEditableLabelComponent({ children, ...props }, ref) {
  const { text, setText, onLabelChange, checked } = useContext(TodoContext)

  return (
    <EditableLabel
      {...props}
      className={cn(
        "data-[completed=true]:text-color data-[completed=true]:line-through grow",
        props.className
      )}
      ref={ref}
      state={[text, setText]}
      data-completed={checked}
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
    if (checked === "indeterminate") if (onCheckedChange) onCheckedChange(false)
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

interface ITodoContext {
  text: string
  setText: React.Dispatch<React.SetStateAction<string>>
  checked?: CheckboxProps["checked"]
  onCheckedChange: CheckboxProps["onCheckedChange"]
  onLabelChange: EditableLabelProps["onAction"]
  initialLabelValue: string
}

const TodoContext = createContext({} as ITodoContext)

type TodoProviderProps = Omit<ITodoContext, "text" | "setText">

export function TodoProvider(
  props: TodoProviderProps & {
    children: React.ReactNode
  }
) {
  const { checked, onCheckedChange, onLabelChange, initialLabelValue } = props
  const [text, setText] = React.useState(initialLabelValue)

  return (
    <TodoContext.Provider
      value={{
        text,
        setText,
        checked,
        onCheckedChange,
        onLabelChange,
        initialLabelValue,
      }}
    >
      {props.children}
    </TodoContext.Provider>
  )
}
