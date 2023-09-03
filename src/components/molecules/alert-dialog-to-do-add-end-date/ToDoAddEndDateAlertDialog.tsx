import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React, { useContext, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { IconCalendar } from "@/components/icons/IconCalendar"
import { ToDoOptionsDropdownContext } from "@/components/molecules/dropdown-options-to-do/ToDoOptionsDropdown"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TaskContext } from "@/contexts/task/taskContext"
import { TaskSession } from "@/fetchs/tasks/schema"
import {
  MutateAddEndDateTaskInput,
  mutateAddEndDateTaskSchema,
  mutateAddEndDateTaskTransform,
} from "@/schemas/task/add-end-date"

export type ToDoAddEndDateAlertDialogProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
  task: TaskSession
}

export const ToDoAddEndDateAlertDialog = React.forwardRef<
  React.ElementRef<"div">,
  ToDoAddEndDateAlertDialogProps
>(function ToDoAddEndDateAlertDialogComponent({ children, ...props }, ref) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { task, addEndDateMutate } = useContext(TaskContext)
  const { setIsDropdownOpen } = useContext(ToDoOptionsDropdownContext)

  const methods = useForm<Pick<MutateAddEndDateTaskInput["payload"], "endDate">>({
    defaultValues: {
      endDate: task.endDate ? new Date(task.endDate) : null,
    },
    resolver: zodResolver(mutateAddEndDateTaskSchema.shape.payload.pick({ endDate: true })),
    mode: "onSubmit",
  })

  const submitHandler: SubmitHandler<
    Pick<MutateAddEndDateTaskInput["payload"], "endDate">
  > = async formData => {
    const { payload } = mutateAddEndDateTaskTransform({
      payload: {
        endDate: formData.endDate,
        taskId: task.id,
      },
      task,
    })
    setIsModalOpen(false)
    setIsDropdownOpen(false)
    addEndDateMutate({ payload, task })
  }

  return (
    <AlertDialog
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
    >
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        {...props}
        contentOffset="14rem"
        className={cn("", props.className)}
        ref={ref}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Update end date</AlertDialogTitle>
          <AlertDialogDescription>
            You're editing the end date for this task:
          </AlertDialogDescription>
          <p className="__two bg-background py-2 px-4 rounded-lg text-color">{task.task}</p>
        </AlertDialogHeader>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitHandler)}
            className="[&>div>label]:mb-1.5 space-y-4"
          >
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
                          defaultMonth={field.value ?? new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-end">
              <AlertDialogCancel asChild>
                <Button
                  variant="default"
                  className="mt-0 order-1 sm:order-none"
                >
                  <span>Cancel</span>
                </Button>
              </AlertDialogCancel>
              <Button
                type="submit"
                className="__action"
              >
                <IconCalendar />
                {task.endDate ? "Change end date" : "Add end date"}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
})

ToDoAddEndDateAlertDialog.displayName = "ToDoAddEndDateAlertDialog"
