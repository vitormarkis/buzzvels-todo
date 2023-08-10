Usage:

```tsx
import {
  TodoProvider,
  TodoContainer,
  TodoCheckbox,
  TodoEditableLabel
} from "@/components/app/todo"

<TodoProvider
  onLabelChange={() => {}}
  onCheckedChange={() => {}}
  checked={false}
>
  <TodoContainer>
    <TodoCheckbox />
    <TodoEditableLabel />
  </TodoContainer>
</TodoProvider>
```
