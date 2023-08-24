import { nanoid } from "nanoid"
import { z } from "zod"

import { mock_Todos } from "@/__tests__/__mocks__/api/task"
import handler from "@/pages/api/task"
import { GetTasksResponse } from "@/utils/api/getTasks"
import { mockRequest } from "@/utils/units/mockRequest"

jest.useFakeTimers().setSystemTime(new Date("2023-01-01"))

jest.mock("@/lib/redis", () => ({
  redis: {
    rpush: jest.fn(),
    hset: jest.fn(),
  },
}))

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "19191919"),
}))

jest.mock("@/utils/api/getTasks", () => ({
  getTasks: jest.fn(
    () =>
      ({
        errors: [],
        failedToGetTasks: false,
        tasks: mock_Todos,
      }) satisfies GetTasksResponse
  ),
}))

describe("/api/tasks", () => {
  let responseStatus: jest.Mock
  let jsonResponse: jest.Mock

  const setupResponseMocks = () => {
    jsonResponse = jest.fn()
    responseStatus = jest.fn(() => ({ json: jsonResponse }))
  }

  beforeEach(() => {
    jest.clearAllMocks()
    setupResponseMocks()
  })

  const mockAuthorizationHeader = (userId: string) => ({
    authorization: `bearer userid_${userId}`,
  })

  describe("POST method", () => {
    const validUserId = "johndoe"

    const createTaskRequest = (taskData: Record<string, any>) =>
      mockRequest(mockAuthorizationHeader(validUserId), "POST", taskData)

    const handleBusinessRuleTest = async (
      taskData: Record<string, any>,
      expectedResponse: {
        status: number
        body: Record<string, any>
      }
    ) => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest(taskData) as any
      await handler(request, response)
      expect(responseStatus).toHaveBeenCalledWith(expectedResponse.status)
      expect(jsonResponse).toHaveBeenCalledWith(expect.objectContaining(expectedResponse.body))
    }

    test("[201] should create and return a new task", async () => {
      const taskData = {
        endDate: 1692748541936,
        task: "task number",
      }
      const expectedResponse = {
        status: 201,
        body: {
          endDate: taskData.endDate,
          isDone: false,
          task: taskData.task,
          createdAt: 1672531200000,
          id: `task_${nanoid()}`,
        },
      }
      await handleBusinessRuleTest(taskData, expectedResponse)
    })

    test("[400] should reject when bad input", async () => {
      const invalidTaskData = {
        task: "",
      }
      const expectedResponse = {
        status: 400,
        body: { message: "Bad input." },
      }
      await handleBusinessRuleTest(invalidTaskData, expectedResponse)
    })

    test("[400] should reject when no body is provided", async () => {
      const emptyTaskData = {}
      const expectedResponse = {
        status: 400,
        body: { message: "Bad input." },
      }
      await handleBusinessRuleTest(emptyTaskData, expectedResponse)
    })

    test("[400] should reject when more payload than needed is provided", async () => {
      const excessivePayload = {
        endDate: null,
        isDone: false,
        task: "task number",
        createdAt: 1672531200000,
        id: `task_${nanoid()}`,
      }
      const expectedResponse = {
        status: 400,
        body: { message: "Bad input." },
      }
      await handleBusinessRuleTest(excessivePayload, expectedResponse)
    })

    test("[201] should create when end date is null", async () => {
      const taskDataWithNullEndDate = {
        endDate: null,
        task: "task number",
      }
      const expectedResponse = {
        status: 201,
        body: {
          endDate: null,
          isDone: false,
          task: taskDataWithNullEndDate.task,
          createdAt: 1672531200000,
          id: `task_${nanoid()}`,
        },
      }
      await handleBusinessRuleTest(taskDataWithNullEndDate, expectedResponse)
    })
  })

  describe("GET method", () => {
    const validUserId = "johndoe"

    const createTaskRequest = (taskData?: Record<string, any>) =>
      mockRequest(mockAuthorizationHeader(validUserId), "GET", taskData)

    const handleBusinessRuleTest = async (
      expectedResponse: {
        status: number
        body: Record<string, any>
      },
      taskData: Record<string, any> = {}
    ) => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest(taskData) as any
      await handler(request, response)
      expect(responseStatus).toHaveBeenCalledWith(expectedResponse.status)
      expect(jsonResponse).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining(expectedResponse.body)])
      )
    }

    test("[201] fetch ", async () => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest() as any
      await handler(request, response)
      const apiResponse = jsonResponse.mock.calls[0][0]
      const apiResponseParse = z
        .array(
          z.object({
            id: z.string(),
            endDate: z.number().nullable(),
            createdAt: z.number(),
            task: z.string(),
            isDone: z.boolean(),
            subtasks: z.array(z.any()),
          })
        )
        .safeParse(apiResponse)
      expect(responseStatus).toHaveBeenCalledWith(200)
      if (!apiResponseParse.success) console.log(apiResponseParse.error)
      expect(apiResponseParse.success).toBeTruthy()
    })
  })
})
