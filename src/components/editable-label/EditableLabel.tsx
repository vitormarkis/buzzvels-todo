import React, {
  ChangeEvent,
  Dispatch,
  FocusEventHandler,
  SetStateAction,
  useRef,
  useState,
} from "react"
import { cn } from "@/lib/utils"
import st from "./EditableLabel.module.css"

export type EditableLabelProps = React.ComponentPropsWithoutRef<"td"> & {
  selectText?: boolean
  state: [value: string, setValue: Dispatch<SetStateAction<string>>]
  onAction: () => void
}

export const EditableLabel = React.forwardRef<React.ElementRef<"td">, EditableLabelProps>(
  function EditableLabelComponent({ onAction, selectText, tabIndex = 0, state, ...props }, ref) {
    const [text, setText] = state
    const [isEditing, setIsEditing] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const editInput = () => {
      setIsEditing(s => !s)
      if (!isEditing) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
            if (selectText) inputRef.current.select()
          }
        }, 0)
      }
    }

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value)
    }

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
      if (onAction) onAction()
      setIsEditing(false)
    }

    return (
      <td
        {...props}
        className={cn(
          "px-4 py-2 align-middle [&:has([role=checkbox])]:pr-0",
          "relative text-color",
          "outline-transparent",
          st.outline,
          "transition-all duration-100",
          props.className
        )}
        ref={ref}
        onDoubleClick={() => editInput()}
        tabIndex={tabIndex}
        onKeyUp={e => {
          if (e.key === "Enter" && !isEditing) editInput()
        }}
      >
        {/* {true && ( */}
        {isEditing && (
          <input
            ref={inputRef}
            type="text"
            className={cn(
              "w-auto px-4 bg-background absolute inset-0 rounded-[inherit]",
              "outline-none",
              props.className
            )}
            onDoubleClick={e => e.stopPropagation()}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            onKeyUp={e => {
              if (e.key === "Enter") {
                setIsEditing(false)
                if (onAction) onAction()
              }
            }}
            value={text}
          />
        )}
        <span
          className={cn("whitespace-pre-wrap cursor-default relative", {
            "opacity-0 -z-10": isEditing || text.length === 0,
          })}
        >
          {text.length === 0 ? "X" : text}
        </span>
      </td>
    )
  }
)

EditableLabel.displayName = "EditableLabel"
