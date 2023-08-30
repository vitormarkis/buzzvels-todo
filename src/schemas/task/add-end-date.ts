import { z } from "zod"

import { taskSchemaAPI } from "@/fetchs/tasks/schema"

export const mutateAddEndDateTaskSchema = z.object({
  taskId: taskSchemaAPI.shape.id,
  endDate: z.date().nullable(),
})

export const mutateAddEndDateTaskTransform = ({ endDate, ...rest }: MutateAddEndDateTaskInput) => ({
  ...rest,
  endDate: endDate?.getTime() ?? null,
})

export type MutateAddEndDateTaskInput = z.input<typeof mutateAddEndDateTaskSchema>
export type MutateAddEndDateTask = ReturnType<typeof mutateAddEndDateTaskTransform>
