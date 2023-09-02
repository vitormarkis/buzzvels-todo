import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAuth } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTasksContext } from "@/contexts/tasks/tasksContext"
import {
  CreateNewTaskForm,
  CreateNewTaskFormInput,
  createNewTaskFormSchema,
} from "@/form/create-new-task/schema"

export type ModalCreateNewTaskProps = React.ComponentPropsWithoutRef<"div"> & {
  children?: React.ReactNode
}

export const ModalCreateNewTask = React.forwardRef<
  React.ElementRef<"div">,
  ModalCreateNewTaskProps
>(function ModalCreateNewTaskComponent({ children, ...props }, ref) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasDeadlineDate, setHasDeadlineDate] = useState<boolean | "indeterminate">("indeterminate")
  const [endDatePickerIsDirty, setEndDatePickerIsDirty] = useState(false)
  const { userId } = useAuth()
  const router = useRouter()
  const { getCreateNewTodoMutate } = useTasksContext()
  const { mutate: createNewTodoMutate } = getCreateNewTodoMutate()

  const onOpenChange = (open: boolean) => {
    if (!userId) {
      router.push("/sign-in")
      return false
    }
    return open
  }

  const methods = useForm<CreateNewTaskFormInput>({
    defaultValues: {
      task: "",
      endDate: null,
      hasDeadlineDate: "indeterminate",
    },
    resolver: zodResolver(createNewTaskFormSchema),
    mode: "onSubmit",
  })

  const endDate = methods.watch("endDate")

  const submitHandler: SubmitHandler<CreateNewTaskFormInput> = async formData => {
    const taskMutateProps = formData as CreateNewTaskForm
    setIsModalOpen(false)
    createNewTodoMutate({ ...taskMutateProps, taskId: `TEMPORARY_${nanoid()}` })
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={open => setIsModalOpen(onOpenChange(open))}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onCloseAutoFocus={() => {
          methods.reset()
          setHasDeadlineDate(false)
        }}
        {...props}
        className={cn("space-y-2", props.className)}
        ref={ref}
      >
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitHandler)}
            className="[&>div>label]:mb-1.5 space-y-4"
          >
            <FormField
              control={methods.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-heading">Task name</FormLabel>
                  <FormControl>
                    <Input
                      className="__two"
                      placeholder="Take the dogs for a walking"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormField
                control={methods.control}
                name="hasDeadlineDate"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value === "indeterminate" ? false : field.value}
                        onCheckedChange={s => {
                          field.onChange(s)
                          setHasDeadlineDate(s)
                          if (endDatePickerIsDirty) methods.trigger("endDate")
                        }}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-color-soft">
                      Set a deadline date for the task
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              className={cn(
                                "__two border text-color w-full pl-3 text-left font-normal",
                                !field.value && "text-color-soft"
                              )}
                              disabled={!hasDeadlineDate || hasDeadlineDate === "indeterminate"}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value ?? new Date()}
                            onSelect={field.onChange}
                            disabled={date => date <= new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2 justify-between">
              <div></div>
              <Button
                type="submit"
                onClick={() => {
                  if (hasDeadlineDate === true && endDate === null) {
                    setEndDatePickerIsDirty(true)
                  }
                }}
                className="__action"
              >
                Add to-do
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

ModalCreateNewTask.displayName = "ModalCreateNewTask"
