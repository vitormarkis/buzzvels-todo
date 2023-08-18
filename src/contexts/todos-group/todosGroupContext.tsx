import React, { createContext, useContext, useState } from "react"

export type TodoGroup = {
  name: string
  label: string
}

export interface ITodosGroupContext {
  todoGroups: TodoGroup[]
  setTodoGroups: React.Dispatch<React.SetStateAction<TodoGroup[]>>
  usingTodoGroup: TodoGroup["name"]
  setUsingTodoGroup: React.Dispatch<React.SetStateAction<TodoGroup["name"]>>
}

export const TodosGroupContext = createContext({} as ITodosGroupContext)

export function TodosGroupProvider(props: { children: React.ReactNode }) {
  const [todoGroups, setTodoGroups] = useState<TodoGroup[]>([
    {
      label: "Home",
      name: "home",
    },
    {
      label: "Job",
      name: "job",
    },
    {
      label: "Family",
      name: "family",
    },
  ])
  const [usingTodoGroup, setUsingTodoGroup] = useState<TodoGroup["name"]>("home")

  const useTodosGroup = (todoGroup: TodoGroup["name"]) => {
    setUsingTodoGroup(todoGroup)
  }

  return (
    <TodosGroupContext.Provider
      value={{
        todoGroups,
        setTodoGroups,
        usingTodoGroup,
        setUsingTodoGroup,
      }}>
      {props.children}
    </TodosGroupContext.Provider>
  )
}

export const useTodosGroup = () => useContext(TodosGroupContext)
