import React, { useId, useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useUserInfo } from "@/contexts/user-info/userInfoContext"
import { useAuth } from "@clerk/nextjs"
import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/router"

export type ModalCreateNewTaskProps = React.ComponentPropsWithoutRef<"div"> & {
  children?: React.ReactNode
  mutate: UseMutateFunction<{}, {}, CreateNewTaskForm>
}

export const ModalCreateNewTask = React.forwardRef<
  React.ElementRef<"div">,
  ModalCreateNewTaskProps
>(function ModalCreateNewTaskComponent({ children, mutate, ...props }, ref) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasDeadlineDate, setHasDeadlineDate] = useState<boolean | "indeterminate">(false)
  const { userId } = useAuth()
  const router = useRouter()

  const onOpenChange = (open: boolean) => {
    if (!userId) {
      router.push("/sign-in")
      return false
    }
    return open
  }

  const methods = useForm<CreateNewTaskForm>({
    defaultValues: {
      task: "",
      endDate: null,
    },
    resolver: zodResolver(createNewTaskFormSchema),
  })

  const submitHandler: SubmitHandler<CreateNewTaskForm> = async formData => {
    setIsModalOpen(false)
    mutate(formData)
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

            <div className="space-y-2">
              <FormField
                control={methods.control}
                name="hasDeadlineDate"
                render={({ field }) => (
                  <FormItem className="flex gap-2 items-center space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={s => {
                          field.onChange(s)
                          setHasDeadlineDate(s)
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
                              disabled={!hasDeadlineDate}
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
