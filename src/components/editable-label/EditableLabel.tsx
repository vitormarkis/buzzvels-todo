import { VariantProps, cva } from "class-variance-authority"
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { handleKeyPressed } from "@/utils/units/handleKeyUp"

import st from "./EditableLabel.module.css"

const editableTextVariables = cva("px-1.5", {
  variants: {
    padding: {
      "v-small": "py-1.5",
      "v-regular": "py-3",
    },
    textStyle: {
      base: "font-medium",
      new: "font-normal italic",
    },
  },
  defaultVariants: {
    padding: "v-regular",
    textStyle: "base",
  },
})

export type EditableLabelProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof editableTextVariables> & {
    selectText?: boolean
    state: [value: string, setValue: Dispatch<SetStateAction<string>>]
    taskId?: string
    disableActionOnNoChange?: boolean
    selectAutoFocus?: boolean
    isCompleted?: boolean
    onAction: (newValue: string) => void
    disableAction?: boolean
    placeholder?: string
  }

export const EditableLabel = React.forwardRef<React.ElementRef<"div">, EditableLabelProps>(
  function EditableLabelComponent(
    {
      taskId,
      onAction,
      selectText,
      tabIndex = 0,
      selectAutoFocus,
      disableActionOnNoChange,
      state,
      isCompleted,
      disableAction,
      padding,
      textStyle,
      placeholder = "Describe your task",
      ...props
    },
    ref
  ) {
    const [text, setText] = state
    const [previousValue, setPreviousValue] = useState(text)
    const [isEditing, setIsEditing] = useState(selectAutoFocus)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
      if (selectAutoFocus) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
          }
        }, 0)
      }
    }, [isEditing])

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
      if (onAction && !disableAction) {
        const shouldGoForward = validateInput(newValue, previousValue)
        if (!shouldGoForward) {
          setText(previousValue)
          return
        }
        onAction(newValue)
      }
    }

    const wrapperHandlers = {
      onDoubleClick(_event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (text.length > 0) editInput()
      },
      handleOnClick(_event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (text.length === 0) editInput()
      },
      onKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
        const actions = {
          Enter() {
            if (!isEditing) editInput()
          },
        } as const

        handleKeyPressed(event, actions)
      },
    }

    const inputHandlers = {
      handleOnKeyUp(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        const actions = {
          Enter() {
            event.preventDefault()
            setIsEditing(false)
            onActionCallback(text)
          },
        } as const

        handleKeyPressed(event, actions)
      },
      handleOnFocus(event: React.FocusEvent<HTMLTextAreaElement, Element>) {
        if (disableActionOnNoChange) setPreviousValue(event.target.value)
      },
      handleOnBlur(event: React.FocusEvent<HTMLTextAreaElement, Element>) {
        setIsEditing(false)
        onActionCallback(text)
      },
      handleOnChange(event: ChangeEvent<HTMLTextAreaElement>) {
        const newValue = event.target.value
        const [lastDigit] = newValue.split("").reverse()
        const digitIsInvalid = ["\n"].includes(lastDigit)
        if (!digitIsInvalid) setText(newValue)
      },
      handleOnDoubleClick(event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) {
        event.stopPropagation()
      },
      handleOnClick(event: React.MouseEvent<HTMLTextAreaElement, MouseEvent>) {
        event.stopPropagation()
      },
    }

    return (
      <div
        {...props}
        className={editableTextVariables({
          padding,
          className: cn(
            "relative text-color outline-transparent align-middle [&:has([role=checkbox])]:pr-0 transition-all duration-100 break-all",
            st.outline,
            props.className
          ),
        })}
        ref={ref}
        tabIndex={tabIndex}
        onClick={wrapperHandlers.handleOnClick}
        onDoubleClick={wrapperHandlers.onDoubleClick}
        onKeyUp={wrapperHandlers.onKeyUp}>
        {/* {true && ( */}
        {isEditing && (
          <textarea
            ref={inputRef}
            className={editableTextVariables({
              padding,
              className: cn(
                "w-auto bg-background absolute inset-0 rounded-[inherit]",
                "outline-none resize-none"
              ),
            })}
            onClick={inputHandlers.handleOnClick}
            onDoubleClick={inputHandlers.handleOnDoubleClick}
            onChange={inputHandlers.handleOnChange}
            onBlur={inputHandlers.handleOnBlur}
            onKeyUp={inputHandlers.handleOnKeyUp}
            onFocus={inputHandlers.handleOnFocus}
            value={text}
          />
        )}
        <span
          data-completed={isCompleted}
          className={cn(
            editableTextVariables({
              textStyle,
              className: cn(
                "whitespace-pre-wrap cursor-default relative text-color-strong data-[completed=true]:text-color-soft data-[completed=true]:line-through",
                {
                  "opacity-0 -z-10": isEditing,
                  "text-color-soft cursor-text": !isEditing && text.length === 0,
                }
              ),
            }),
            "px-0"
          )}>
          {text.length === 0 ? placeholder : text}
        </span>
      </div>
    )
  }
)

EditableLabel.displayName = "EditableLabel"

function validateInput(newValue: string, previousValue: string) {
  // prettier-ignore
  const isValid = [
    newValue !== previousValue,
    newValue.length > 0, 
  ].every(Boolean)

  return isValid
}
