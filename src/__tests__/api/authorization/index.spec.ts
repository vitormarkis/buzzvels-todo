import { default as handler_subtask } from "@/pages/api/subtask"
import { default as handler_subtaskId } from "@/pages/api/subtask/[subtaskId]"
import { default as handler_subtaskIdToggle } from "@/pages/api/subtask/[subtaskId]/toggle"
import { default as handler_task } from "@/pages/api/task"
import { default as handler_taskId } from "@/pages/api/task/[taskId]"
import { default as handler_taskIdToggle } from "@/pages/api/task/[taskId]/toggle"
import { mockRequest } from "@/utils/units/mockRequest"

jest.mock("nanoid", () => ({
  nanoid: () => "19191919",
}))

jest.mock("@/lib/redis", () => ({
  redis: {
    rpush: jest.fn(async () => {}),
    hset: jest.fn(async () => {}),
  },
}))

// prettier-ignore
const apiRouteHandlers = [
  { handler: handler_task, method: "POST", shouldAuth: true, label: "api/tasks", },
  { handler: handler_task, method: "GET", shouldAuth: true, label: "api/tasks", },
  { handler: handler_taskId, method: "DELETE", shouldAuth: true, label: "api/tasks/[taskId]", }, 
  { handler: handler_taskId, method: "PATCH", shouldAuth: true, label: "api/tasks/[taskId]", },
  { handler: handler_taskIdToggle, method: "PATCH", shouldAuth: true, label: "api/tasks/[taskId]/toggle", },
  { handler: handler_subtask, method: "POST", shouldAuth: true, label: "api/subtask", },
  { handler: handler_subtask, method: "DELETE", shouldAuth: true, label: "api/subtask", },
  { handler: handler_subtaskId, method: "PATCH", shouldAuth: true, label: "api/subtask/[subtaskId]", },
  { handler: handler_subtaskIdToggle, method: "PATCH", shouldAuth: true, label: "api/subtask/[subtaskId]/toggle", },
  ]

describe("authentication", () => {
  let jsonResponse: jest.Mock
  let statusResponse: jest.Mock

  const setupResponseMocks = () => {
    jsonResponse = jest.fn()
    statusResponse = jest.fn(() => ({ json: jsonResponse }))
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setupResponseMocks()
  })

  describe("test", () => {
    apiRouteHandlers.forEach(({ handler, label, method, shouldAuth }) => {
      test(`auth-test [${method}] ${label}`, async () => {
        const request = mockRequest({}, method, {}) as any
        await handler(request, { status: statusResponse } as any)

        if (shouldAuth) {
          expect(statusResponse).toHaveBeenCalledWith(401)
        } else {
          expect(statusResponse).not.toHaveBeenCalledWith(401)
        }
      })
    })
  })
})
