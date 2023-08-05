import { z } from "zod"

export const createNewTaskFormSchema = z
  .object({
    task: z.string().min(1, "Insert a valid task name."),
    endDate: z.date().nullable().default(null),
    hasDeadlineDate: z.boolean().default(false),
  })
  .transform(({ hasDeadlineDate, ...state }) => ({
    ...state,
    endDate: hasDeadlineDate ? state.endDate?.getTime() : null,
  }))

export type CreateNewTaskForm = z.input<typeof createNewTaskFormSchema>
