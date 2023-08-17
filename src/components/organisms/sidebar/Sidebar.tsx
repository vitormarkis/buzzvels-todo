import { useTodosGroup } from "@/contexts/todos-group/todosGroupContext"

export function Sidebar() {
  const { todoGroups, usingTodoGroup, setUsingTodoGroup } = useTodosGroup()

  return (
    <>
      <p className="mt-4 text-center text-color text-sm w-full">You're welcome!</p>
      {/* <div className="flex flex-col w-full">
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
      </div> */}
    </>
  )
}

Sidebar.displayName = "Sidebar"
