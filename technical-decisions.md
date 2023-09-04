### Technical Decisions
To create the user interface, I opted for React with Next as framework. Regarding the API, I made user of the Next.js route APIs. When it comes to database, I was willing to learn about an in-memory database, so I opted for Redis as the database for this project so I can learn as I go while building it.

### User experience
In terms of user experience, I decided to take these approaches:

- I implemented a **task placeholder** feature. When a user creates a new task and submits the form to add it, I modify the tasks cache, adding the new task. Initially, I add the new task with placeholder values for sensitive properties like `id` and `createdAt`, which typically are expected to come from the server. If the server responds with a success, I then replace these placeholder values with the actual ones provided by the server. However, if the server response fails, I remove the placeholder task from the cache.

- I implemented a **task backup** feature when user edits an existing task. For instance, when they modifies the task's text, three significant things happens:
	- A copy of the edited task is saved in a state, preserving the old data.
	- The task's cache is updated with the new text, showing new data to the UI.
	- A request is sent to the server to modify the task's text.
If the request fails, the cache switches the edited task with the backup one, which holds the old data.

- To improve the user experience while user is waiting the tasks to be fetched from the server, I've implemented **tasks skeletons** to be displayed when tasks haven't been retrevied yet.
- For straightforward actions like removing an end date from a task, there is straightforward confirmation method.
- For more significant actions like deleting a task, there is a dedicated modal that provides details for the user of the action they are about to take.

### Code good practices
I've implemented an abstraction to manage the cache mutations:
Developers should instantiate a `QueryCache` factory using [createQueryCache](https://github.com/vitormarkis/buzzvels-todo/blob/main/src/factories/createQueryCache.ts),  [createTasksCache](https://github.com/vitormarkis/buzzvels-todo/blob/main/src/factories/createQueryCache.ts). This `QueryCache` provide straightforward known methods to mutate cache data.

If developer wants to:
Delete a task, he calls:
```javascript
QueryCache.tasks.delete("taskid")
```

Update a task's text, he calls:
```javascript
QueryCache.tasks.patch("taskid", currentTask => ({
	...currentTask,
	text: "new text"
}))
```

Add a task, he calls:
```javascript
QueryCache.tasks.add({
	id: ...,
	text: ...,
	createdAt: ...,
	...
})
```

Simple as that.

Additionally, I've defined all the mutations and queries within a provider. This way I can supply to all the elements tree, these variables, ensuring easy access from popovers, modals and dialogs.

I've defined the mutations getters with some default options, but the developer can add some extra properties or callbacks, just like this example.

`// src/contexts/tasks/tasksContext.tsx`
```javascript
const getCreateNewSubtaskMutate = useCallback(options => {
    const { onMutate, onSuccess, onError, retry = 3, ...mutateOptions } = options ?? {}
      
    return useMutation({
      mutationFn: ({ subtaskId, isNewSubtaskDone, ...props }) =>
        createNewSubtaskMutationFunction(props, headers),
      onMutate: (...args) => {
        const [{ taskId, task, subtaskId, isNewSubtaskDone }] = args
        if (onMutate) onMutate(...args)

        QueryCache.subtasks.add({
          id: subtaskId,
          isDone: !!isNewSubtaskDone,
          createdAt: new Date().getTime(),
          task,
          taskId
        })
      },
      onError: (...args) => {
        if (onError) onError(...args)
        toast({
          variant: "destructive",
          title: "Failed to create sub-task",
          description: (
            <>
              Something went wrong on our server during the creation of your
              sub-task, <strong>please try again.</strong>
            </>
          )
        })
      },
      onSuccess: (...args) => {
        const [{ createdAt, id }, { subtaskId, taskId }] = args
        if (onSuccess) onSuccess(...args)

        QueryCache.subtasks.patch(
          {
            taskId,
            subtaskId
          },
          currentSubtask => ({
            ...currentSubtask,
            createdAt,
            id
          })
        )
      },
      retry,
      ...mutateOptions
    })
  },
  [createNewSubtaskMutationFunction, toast, QueryCache]
)
```

And now developer can instantiate a `createNewSubtaskMutate` with all the default values, AND with the extra options passed on in the declaration. In this particular case, the `onMutate` function should ALSO reset states related to addition of a new subtask.

`// src/components/molecules/to-do/ToDo.tsx(72:3)`
```typescript
const { mutate: createNewSubtaskMutate } = getCreateNewSubtaskMutate({
    onMutate: () => resetNewSubtaskState(),
  })
```

### Tests
All the API endpoint handler functions have being unit tested with significant portion of possible scenarios, you can run these tests by running: `npm run test` 

### API
I've created two line-middlewares to copy and paste in the endpoints as per developer's preference. Each middleware function performs validation on something and provides a boolean indicating the success status along with the it's JSON response. This approach makes it easier to manage, handle, copy and paste, and to choose middlewares, and also enhance testability.
```javascript
function handler(req, res) {
  const auth = getAuth(req)
  if (!auth.isAuth) return res.status(401).json(auth.responseJson)
  
  const queryParsed = queryParser(req, querySchema)
  if (!queryParsed.parse.success) return res.status(400).json(queryParsed.json)
  
  const bodyParsed = bodyParser(req, bodySchema)
  if (!bodyParsed.parse.success) return res.status(400).json(bodyParsed.json)
  
  const { taskId } = queryParsed.parse.data
  const { endDate } = bodyParsed.parse.data
  
  const performTransaction = () => redis.hset(taskId, { endDate })
  
  const operation = await getTransactionResponse(performTransaction)
  if (!operation.success) return res.status(500).json(getFailedJson("task", req))
  ...
}
```


### Styling
The styling was created following a design pattern called **Container's Anatomy Driven Design**. This approach involves connecting element styles to a CSS variables through Tailwind, and then you can provide different color palettes inline as you wish.

**Component declaration**
```jsx
function Button(props) {
  return (
    <button className="bg-background text-color">
      {props.children}
    </button>
  )
}
```

**Link element to CSS variables via Tailwind**
```javascript
// tailwind.config.js
colors: {
  background: "var(--background)",
  color: "var(--color)",
}
```

**Component link to CSS variables**
```css
.__action {
  --background: purple;
  --color: white;
}

.__block {
  --background: red;
  --color: white;
}
```

**Usage**
```jsx
<Button className="__action" />
<Button className="__block" />
```

**Output**\
<img src="https://github.com/vitormarkis/buzzvels-todo/assets/121525239/05fff5d2-60ce-45c4-9cff-8907b48e0e91" alt="output" />


Of course it's more complex than that but that is the core concept.

### Why should I use Container's Anatomy Driven Design?
Because you can efficiently establish a consistent design pattern to all your UI screens, by defining the color palettes. This way you can effortlessly create more components and elements without the need to be concerned about colors. Once you pass a color palette on the root level of an element, it will propagate the colors for all the subsequent elements.

Here is a showcase project: [CADD Showcase (new modal 0830 branch](https://github.com/vitormarkis/nomenclatura-mentor-cycle/tree/new-modal-0830)

CADD was created by me, Vitor Markis.
