import { z } from "zod"

export const mutateChangeTaskTextSchema = z.object({
  text: z.string().min(1),
  taskId: z.string(),
})

export type MutateChangeTaskTextInput = z.input<typeof mutateChangeTaskTextSchema>
export type MutateChangeTaskText = z.output<typeof mutateChangeTaskTextSchema>
