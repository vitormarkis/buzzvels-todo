import handler from "@/pages/api/task/[taskId]/endDate"
import { performOperation } from "@/utils/performTransaction"
import { mockRequest } from "@/utils/units/mockRequest"

jest.useFakeTimers().setSystemTime(new Date("2023-01-01"))

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

    type TestPayload = {
      query?: Record<string, any>
      body: Record<string, any>
      status: number
      expectedResponse: Record<string, any>
    }

    const runTest = async ({
      body,
      expectedResponse,
      status,
      query = { taskId: "taskid_494949" },
    }: TestPayload) => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest({
        query,
        body,
      }) as any
      await handler(request, response)
      expect(jsonResponse).toHaveBeenCalledWith(expect.objectContaining(expectedResponse))
      expect(responseStatus).toHaveBeenCalledWith(status)
    }

    test("[400] should reject when invalid query is provided", async () => {
      await runTest({
        query: { hello: "world" },
        body: {
          endDate: new Date().getTime(),
        },
        status: 400,
        expectedResponse: {
          message: "Bad input.",
        },
      })
    })

    test("[200] should reject when no body is provided", async () => {
      await runTest({
        body: {},
        status: 400,
        expectedResponse: {
          message: "Bad input.",
        },
      })
    })

    test("[200] should remove endDate when value is null", async () => {
      await runTest({
        body: {
          endDate: null,
        },
        status: 200,
        expectedResponse: {
          message: "Removed end date from task with success!",
          endDate: null,
        },
      })
    })

    test("[200] should update/create endDate when value is number", async () => {
      await runTest({
        body: {
          endDate: new Date().getTime(),
        },
        status: 200,
        expectedResponse: {
          message: "Added end date from task with success!",
          endDate: 1672531200000,
        },
      })
    })

    test("[200] should update/create endDate when value is a Date", async () => {
      await runTest({
        body: {
          endDate: new Date(),
        },
        status: 200,
        expectedResponse: {
          message: "Added end date from task with success!",
          endDate: 1672531200000,
        },
      })
    })

    test("[400] should reject when invalid properties are provided", async () => {
      await runTest({
        body: {
          hello: "world",
        },
        status: 400,
        expectedResponse: {
          message: "Bad input.",
        },
      })
    })

    test("[400] should reject when more payload than needed is provided", async () => {
      await runTest({
        body: {
          endDate: null,
          moreProps: true,
        },
        status: 400,
        expectedResponse: {
          message: "Bad input.",
        },
      })
    })

    test("[500] should reject when failed to delete on database", async () => {
      ;(performOperation as jest.Mock).mockImplementationOnce(() => ({
        success: false,
      }))

      await runTest({
        body: {
          endDate: new Date().getTime(),
        },
        status: 500,
        expectedResponse: {
          message: `Operation failed [PATCH]:task, something wrong on database!`,
        },
      })
    })
  })
})
