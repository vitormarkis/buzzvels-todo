import { z } from "zod"

import { taskSchemaAPI, taskSessionSchema } from "@/fetchs/tasks/schema"

export const mutateAddEndDateTaskSchema = z.object({
  payload: z
    .object({
      taskId: taskSchemaAPI.shape.id,
      endDate: z.date().nullable(),
    })
    .strict(),
  task: taskSessionSchema,
})

export const mutateAddEndDateTaskTransform = ({
  payload,
  ...rest
}: MutateAddEndDateTaskInput): MutateAddEndDateTaskInput => ({
  ...rest,
  payload: {
    ...payload,
    endDate: payload.endDate ? new Date(payload.endDate) : null,
  },
})

export type MutateAddEndDateTaskInput = z.infer<typeof mutateAddEndDateTaskSchema>
export type MutateAddEndDateTask = ReturnType<typeof mutateAddEndDateTaskTransform>
