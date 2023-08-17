import { z } from "zod"

export const createNewTaskFormSchema = z
  .object({
    task: z.string().min(1, "Insert a valid task name."),
    endDate: z.date().nullable().default(null),
    hasDeadlineDate: z.boolean().default(false),
  })
  .transform(({ hasDeadlineDate, ...state }) => {
    const getEndDate = () => {
      if (!hasDeadlineDate || !state.endDate) return null
      return state.endDate.getTime()
    }

    const endDate = getEndDate()

    return {
      ...state,
      endDate,
    }
  })

export type CreateNewTaskFormInput = z.input<typeof createNewTaskFormSchema>
export type CreateNewTaskForm = z.output<typeof createNewTaskFormSchema>
