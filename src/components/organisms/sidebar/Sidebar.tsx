"use client"
import React from "react"
import { cn } from "@/lib/utils"
import { useTodosGroup } from "@/contexts/todos-group/todosGroupContext"
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

export function Sidebar() {
  const { todoGroups, usingTodoGroup, setUsingTodoGroup } = useTodosGroup()

  return (
    <>
      <div className="flex flex-col w-full">
        {todoGroups.map(group => (
          <button
            key={group.name}
            className={cn(
              "h-8 text-sm flex items-center px-4 hover:bg-background-shadow border-l hover:border-color transition",
              group.name === usingTodoGroup &&
                "__two bg-background border-l-accent hover:border-l-accent"
            )}
            onClick={() => setUsingTodoGroup(group.name)}
          >
            {group.label}
          </button>
        ))}
      </div>
    </>
  )
}

Sidebar.displayName = "Sidebar"
