import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import React, { useContext, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"

import { IconTrash } from "@/components/icons/IconTrash"
import { MutateDeleteTask } from "@/components/molecules/to-do/ToDo"
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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

  const methods = useForm<Pick<MutateAddEndDateTaskInput, "endDate">>({
    defaultValues: {
      endDate: null,
    },
    resolver: zodResolver(mutateAddEndDateTaskSchema.pick({ endDate: true })),
    mode: "onSubmit",
  })

  const submitHandler: SubmitHandler<
    Pick<MutateAddEndDateTaskInput, "endDate">
  > = async formData => {
    const { taskId, endDate } = mutateAddEndDateTaskTransform({
      endDate: formData.endDate,
      taskId: task.id,
    })
    addEndDateMutate({ taskId, endDate })
  }

  return (
    <AlertDialog
      open={isModalOpen}
      onOpenChange={setIsModalOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent
        {...props}
        className={cn("", props.className)}
        ref={ref}>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitHandler)}
            className="[&>div>label]:mb-1.5 space-y-4">
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
                            )}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto p-0"
                        align="start">
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
            <div className="flex gap-2 justify-between">
              <div></div>
              <Button
                type="submit"
                className="__action">
                Add end date
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
})

ToDoAddEndDateAlertDialog.displayName = "ToDoAddEndDateAlertDialog"