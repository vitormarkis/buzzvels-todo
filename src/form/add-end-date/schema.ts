import { z } from "zod"

export const addEndDateFormSchema = z
  .object({
    endDate: z.coerce.date().nullable().default(null),
  })
  .superRefine((data, ctx) => {
    if (data.endDate === null) {
      ctx.addIssue({
        code: "invalid_date",
        path: ["endDate"],
        message: "Set an end date for your task.",
      })
    }
  })
  .transform(({ endDate }) => ({ endDate: endDate?.getTime() ?? null }))

export const addEndDateFormSchemaBody = z
  .object({
    task: z.string().min(1, "Insert a valid task name."),
    endDate: z.number().nullable(),
  })
  .strict()

export type addEndDateFormInput = z.input<typeof addEndDateFormSchema>
export type addEndDateForm = z.output<typeof addEndDateFormSchema>

export type addEndDateFormBodyInput = z.input<typeof addEndDateFormSchemaBody>
export type addEndDateFormBody = z.output<typeof addEndDateFormSchemaBody>
