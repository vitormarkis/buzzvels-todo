Usage:

```tsx
import {
  TodoProvider,
  TodoContainer,
  TodoCheckbox,
  TodoEditableLabel,
  TodoActionsContainer,
  TodoAction
} from "@/components/app/todo"

<TodoProvider
  onLabelChange={() => {}}
  onCheckedChange={() => {}}
  checked={false}
  initialLabelValue=""
>
  <TodoContainer>
    <TodoCheckbox />
    <TodoEditableLabel />
    <TodoActionsContainer>
      <TodoAction onClick={() => {}}>
        <Icon>
      </TodoAction>
    </TodoActionsContainer>
  </TodoContainer>
</TodoProvider>
```
