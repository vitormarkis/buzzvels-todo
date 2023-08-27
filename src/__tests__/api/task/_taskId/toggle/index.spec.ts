import handler from "@/pages/api/task/[taskId]/toggle"
import { performOperation } from "@/utils/performTransaction"
import { mockRequest } from "@/utils/units/mockRequest"

jest.mock("@/utils/performTransaction", () => ({
  performOperation: jest.fn(() => ({
    success: true,
  })),
}))

jest.mock("@/lib/redis", () => ({
  redis: {
    hset: jest.fn(),
  },
}))

describe("/api/task/[taskId]/toggle", () => {
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

  describe("PATCH method", () => {
    const validUserId = "johndoe"

    const createTaskRequest = (params: {
      query: Record<string, any>
      body?: Record<string, any>
    }) => {
      const { query, body = {} } = params ?? {}

      return {
        ...mockRequest(mockAuthorizationHeader(validUserId), "PATCH", body),
        query,
      }
    }

    test("[200] should patch task when valid body is provided", async () => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest({
        query: { taskId: "taskid_191919" },
        body: {
          isDone: false,
        },
      }) as any
      await handler(request, response)
      expect(responseStatus).toHaveBeenCalledWith(200)
      expect(jsonResponse).toHaveBeenCalledWith({
        message: "Toggled task successfully.",
      })
    })

    test("[400] should reject when bad input is provided", async () => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest({
        query: { john: false },
        body: {
          isDone: "true",
        },
      }) as any
      await handler(request, response)
      expect(responseStatus).toHaveBeenCalledWith(400)
      expect(jsonResponse).toHaveBeenCalledWith(expect.objectContaining({ message: "Bad input." }))
    })

    test("[500] should reject when failed to delete on database", async () => {
      ;(performOperation as jest.Mock).mockImplementationOnce(() => ({
        success: false,
      }))

      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest({
        query: { taskId: "taskid_191919" },
        body: {
          isDone: false,
        },
      }) as any
      await handler(request, response)
      expect(jsonResponse).toHaveBeenCalledWith({
        message: `Operation failed [PATCH]:task, something wrong on database!`,
      })
      expect(responseStatus).toHaveBeenCalledWith(500)
    })
  })

  describe("PATCH method", () => {
    const validUserId = "johndoe"

    const createTaskRequest = (params: {
      query: Record<string, any>
      body?: Record<string, any>
    }) => {
      const { query, body = {} } = params ?? {}

      return {
        ...mockRequest(mockAuthorizationHeader(validUserId), "PATCH", body),
        query,
      }
    }

    test("[200] should patch task when valid body is provided", async () => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest({
        query: { taskId: "taskid_191919" },
        body: {
          isDone: false,
        },
      }) as any
      await handler(request, response)
      expect(responseStatus).toHaveBeenCalledWith(200)
      expect(jsonResponse).toHaveBeenCalledWith({
        message: "Toggled task successfully.",
      })
    })

    test("[400] should reject when bad input is provided", async () => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest({
        query: { john: false },
        body: {
          isDone: "true",
        },
      }) as any
      await handler(request, response)
      expect(responseStatus).toHaveBeenCalledWith(400)
      expect(jsonResponse).toHaveBeenCalledWith(expect.objectContaining({ message: "Bad input." }))
    })

    test("[500] should reject when failed to delete on database", async () => {
      ;(performOperation as jest.Mock).mockImplementationOnce(() => ({
        success: false,
      }))

      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest({
        query: { taskId: "taskid_191919" },
        body: {
          isDone: false,
        },
      }) as any
      await handler(request, response)
      expect(jsonResponse).toHaveBeenCalledWith({
        message: `Operation failed [PATCH]:task, something wrong on database!`,
      })
      expect(responseStatus).toHaveBeenCalledWith(500)
    })
  })
})
