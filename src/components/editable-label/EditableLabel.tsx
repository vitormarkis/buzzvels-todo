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
import { handleKeyPressed } from "@/utils/units/handleKeyUp"

export type EditableLabelProps = React.ComponentPropsWithoutRef<"td"> & {
  selectText?: boolean
  state: [value: string, setValue: Dispatch<SetStateAction<string>>]
  onAction: (newValue: string) => void
  taskId?: string
  disableActionOnNoChange?: boolean
}

export const EditableLabel = React.forwardRef<React.ElementRef<"td">, EditableLabelProps>(
  function EditableLabelComponent(
    { taskId, onAction, selectText, tabIndex = 0, disableActionOnNoChange, state, ...props },
    ref
  ) {
    const [text, setText] = state
    const [previousValue, setPreviousValue] = useState(text)
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

    const onActionCallback: typeof onAction = newValue => {
      if (onAction) {
        if (disableActionOnNoChange && text === previousValue) return
        onAction(newValue)
      }
    }

    const wrapperHandlers = {
      onDoubleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        editInput()
      },
      onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        const actions = {
          Enter() {
            if (!isEditing) editInput()
          },
        } as const

        handleKeyPressed(event, actions)
      },
    }

    const inputHandlers = {
      handleOnKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        const actions = {
          Enter() {
            setIsEditing(false)
            onActionCallback(text)
          },
        } as const

        handleKeyPressed(event, actions)
      },
      handleOnFocus(event: React.FocusEvent<HTMLInputElement, Element>) {
        if (disableActionOnNoChange) setPreviousValue(event.target.value)
      },
      handleOnBlur(event: React.FocusEvent<HTMLInputElement, Element>) {
        setIsEditing(false)
        onActionCallback(text)
      },
      handleOnChange(event: ChangeEvent<HTMLInputElement>) {
        return setText(event.target.value)
      },
      handleOnDoubleClick(event: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        event.stopPropagation()
      },
    }

    return (
      <div
        {...props}
        className={cn(
          "px-1.5 py-1",
          "align-middle [&:has([role=checkbox])]:pr-0",
          "relative text-color",
          "outline-transparent",
          st.outline,
          "transition-all duration-100",
          props.className
        )}
        ref={ref}
        tabIndex={tabIndex}
        onDoubleClick={wrapperHandlers.onDoubleClick}
        onKeyUp={wrapperHandlers.onKeyUp}
      >
        {/* {true && ( */}
        {isEditing && (
          <input
            ref={inputRef}
            type="text"
            className={cn(
              "w-auto px-1.5 bg-background absolute inset-0 rounded-[inherit]",
              "outline-none",
              props.className
            )}
            onDoubleClick={inputHandlers.handleOnDoubleClick}
            onChange={inputHandlers.handleOnChange}
            onBlur={inputHandlers.handleOnBlur}
            onKeyUp={inputHandlers.handleOnKeyUp}
            onFocus={inputHandlers.handleOnFocus}
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
        <span className="text-xs text-color-soft">{taskId}</span>
      </div>
    )
  }
)

EditableLabel.displayName = "EditableLabel"
