import { nanoid } from "nanoid"
import { NextApiRequest } from "next"
import { z } from "zod"
import { redis } from "@/lib/redis"
import { mock_Todos } from "@/__mocks__/api/task"
import handler from "@/pages/api/task"
import { GetTasksResponse } from "@/utils/api/getTasks"
import { mockRequest } from "@/utils/units/mockRequest"
import { validateOperation } from "@/utils/validateOperation"

jest.useFakeTimers().setSystemTime(new Date("2023-01-01"))
jest.mock("@/lib/redis", () => ({
  redis: {
    multi: jest.fn(() => ({
      rpush: jest.fn(() => ({
        hset: jest.fn(() => ({
          exec: jest.fn(async () => Promise.resolve()),
        })),
      })),
    })),
  },
}))

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "19191919"),
}))

jest.mock("@/utils/validateOperation", () => ({
  validateOperation: jest.fn(() => ({ operationSuccess: true })),
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
      expect(jsonResponse).toHaveBeenCalledWith(expect.objectContaining(expectedResponse.body))
      expect(responseStatus).toHaveBeenCalledWith(expectedResponse.status)
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

    test("[500] should reject when failed to delete on database", async () => {
      // @ts-ignore
      jest.spyOn(redis, "multi").mockImplementation(() => ({
        rpush: jest.fn(() => ({
          hset: jest.fn(() => ({
            exec: jest.fn(() => Promise.reject()),
          })),
        })),
      }))

      const taskDataWithNullEndDate = {
        endDate: null,
        task: "task number",
      }
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest(taskDataWithNullEndDate) as any
      await handler(request, response)
      expect(jsonResponse).toHaveBeenCalledWith({
        message: "Operation failed [POST]:task, something wrong on database!",
      })
      expect(responseStatus).toHaveBeenCalledWith(500)

      jest.spyOn(redis, "multi").mockRestore()
    })
  })

  describe("GET method", () => {
    const validUserId = "johndoe"

    const createTaskRequest = (taskData?: Record<string, any>) =>
      mockRequest(mockAuthorizationHeader(validUserId), "GET", taskData)

    test("[200] fetch tasks properly", async () => {
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

    test("[500] should reject when failed to fetch on database", async () => {
      ;(validateOperation as jest.Mock).mockImplementation(() => ({ operationSuccess: false }))

      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest() as any
      await handler(request, response)
      expect(jsonResponse).toHaveBeenCalledWith({
        message: `Operation failed [GET]:tasks, something wrong on database!`,
      })
      expect(responseStatus).toHaveBeenCalledWith(500)
    })
  })
})
