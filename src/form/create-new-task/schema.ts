import { z } from "zod"

import { parseUnknownDateToTime, parseUnknownToDate } from "@/utils/units/parseUnknownToDate"

export const createNewTaskFormSchema = z
  .object({
    task: z.string().min(1, "Insert a valid task name."),
    endDate: z.coerce.date().nullable().default(null),
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

export const createNewTaskFormSchemaBody = z
  .object({
    task: z.string().min(1, "Insert a valid task name."),
    endDate: z.preprocess(
      i => (i === null ? null : parseUnknownDateToTime(i)),
      z.number().nullable()
    ),
  })
  .strict()

export type CreateNewTaskFormInput = z.input<typeof createNewTaskFormSchema>
export type CreateNewTaskForm = z.output<typeof createNewTaskFormSchema>

export type CreateNewTaskFormBodyInput = z.input<typeof createNewTaskFormSchemaBody>
export type CreateNewTaskFormBody = z.output<typeof createNewTaskFormSchemaBody>
