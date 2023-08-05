import { z } from "zod"

export const createNewTaskFormSchema = z.object({
  task: z.string().min(1, "Insert a valid task name."),
  endDate: z.date().nullable(),
})

export type CreateNewTaskForm = z.infer<typeof createNewTaskFormSchema>
