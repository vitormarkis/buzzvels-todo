"use client"

import React from "react"
import { cn } from "@/lib/utils"
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { SubmitHandler, useForm } from "react-hook-form"
import { CreateNewTaskForm, createNewTaskFormSchema } from "@/form/create-new-task/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

export type ModalCreateNewTaskProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode
}

export const ModalCreateNewTask = React.forwardRef<
  React.ElementRef<"div">,
  ModalCreateNewTaskProps
>(function ModalCreateNewTaskComponent({ children, ...props }, ref) {
  const methods = useForm<CreateNewTaskForm>({
    defaultValues: {
      task: "",
      endDate: null,
    },
    resolver: zodResolver(createNewTaskFormSchema),
  })

  const { control } = methods

  const submitHandler: SubmitHandler<CreateNewTaskForm> = formData => {
    console.log(formData)
  }

  const formErrors = methods.formState.errors

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        {...props}
        className={cn("space-y-2", props.className)}
        ref={ref}
      >
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
          <DialogDescription>
            To create a new task please provide details about the task you're willing to do, along
            with it's sub tasks.
          </DialogDescription>
        </DialogHeader>

        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitHandler)}
            className="[&>div>label]:mb-1.5 space-y-4"
          >
            <FormField
              control={control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task name</FormLabel>
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
            <FormField
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date for the task completation</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "__two w-full pl-3 text-left font-normal",
                              !field.value && "text-color-strong"
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
                className="__action"
              >
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

ModalCreateNewTask.displayName = "ModalCreateNewTask"