import React, { createContext, useCallback, useContext, useMemo } from "react"

export interface ITasksListStateContext {
  toggleSort: (key: SortMethods) => void
  sort: Sort
  sortCurrent: SortCurrent
  lastSort: SortText | SortDate | null
  resetSort: () => void
  setSortState<T extends SortMethods>(
    props: [sortingMethod: T, sortingValue: Sort[T][number]]
  ): void
  setLastSort: React.Dispatch<React.SetStateAction<SortAllKeys>>
}

export const TasksListStateContext = createContext({} as ITasksListStateContext)

const sortValues = {
  text: [null, "text-desc", "text-asc"],
  date: [null, "createdAt-desc", "createdAt-asc", "expiresAt-desc", "expiresAt-asc"],
} as const

export type Sort = typeof sortValues
export type SortMethods = keyof typeof sortValues
export type SortText = Sort["text"][number]
export type SortDate = Sort["date"][number]
export type SortAllKeysValid = NonNullable<SortText> | NonNullable<SortDate>
export type SortAllKeys = SortAllKeysValid | null
export type SortCurrent = {
  [K in SortMethods]: Sort[K][number]
}

export function TasksListStateProvider(props: { children: React.ReactNode }) {
  const [sort, setSort] = React.useState<Sort>(sortValues)
  const [lastSort, setLastSort] = React.useState<SortAllKeys>(null)

  const toggleSort = useCallback(
    function (key: SortMethods) {
      const [toggledMethod, ...methods] = sort[key]
      const [newToggleMethod] = methods
      setLastSort(newToggleMethod)
      setSort(currentSort => ({ ...currentSort, [key]: [...methods, toggledMethod] }))
    },
    [sort, setSort]
  )

  function setSortState<T extends SortMethods>(
    props: [sortingMethod: T, sortingValue: Sort[T][number]]
  ) {
    const [sortingMethod, sortingValue] = props
    setLastSort(sortingValue)
    let newSortState = { ...sort }
    do {
      const [firstItem, ...rest] = newSortState[sortingMethod]
      newSortState[sortingMethod] = [...rest, firstItem] as any
    } while (newSortState[sortingMethod][0] !== sortingValue)
    setSort(newSortState)
  }

  const resetSort = useCallback(
    function () {
      setSort(sortValues)
    },
    [setSort, sortValues]
  )

  const sortCurrent: SortCurrent = useMemo(
    function () {
      return {
        date: sort["date"][0],
        text: sort["text"][0],
      }
    },
    [sort]
  )

  return (
    <TasksListStateContext.Provider
      value={{
        sort,
        toggleSort,
        sortCurrent,
        lastSort,
        resetSort,
        setSortState,
        setLastSort,
      }}
    >
      {props.children}
    </TasksListStateContext.Provider>
  )
}

export const useTasksListState = () => useContext(TasksListStateContext)
