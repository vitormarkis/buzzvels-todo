import handler from "@/pages/api/subtask"
import { mockRequest } from "@/utils/units/mockRequest"

jest.useFakeTimers().setSystemTime(new Date("2023-01-01"))

jest.mock("@/lib/redis", () => ({
  redis: {
    del: jest.fn(),
    rpush: jest.fn(),
    hset: jest.fn(),
    lrem: jest.fn(),
  },
}))

jest.mock("nanoid", () => ({
  nanoid: jest.fn(() => "19191919"),
}))

describe("/api/subtask", () => {
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

    const createSubtaskRequest = (subtaskData: Record<string, any>) =>
      mockRequest(mockAuthorizationHeader(validUserId), "POST", subtaskData)

    const handleBusinessRuleTest = async (
      subtaskData: Record<string, any>,
      expectedResponse: {
        status: number
        body: Record<string, any>
      }
    ) => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createSubtaskRequest(subtaskData) as any
      await handler(request, response)
      expect(responseStatus).toHaveBeenCalledWith(expectedResponse.status)
      expect(jsonResponse).toHaveBeenCalledWith(expect.objectContaining(expectedResponse.body))
    }

    test.only("[201] should create and return a new task", async () => {
      const subtaskData = {
        isDone: false,
        task: "review something",
        taskId: "taskid_2020",
      }
      const expectedResponse = {
        status: 201,
        body: {
          createdAt: new Date().getTime(),
          id: "subtask_19191919",
          isDone: subtaskData.isDone,
          task: subtaskData.task,
          taskId: subtaskData.taskId,
        },
      }
      await handleBusinessRuleTest(subtaskData, expectedResponse)
    })

    test.only("[400] should reject when bad input", async () => {
      const invalidSubtaskData = {
        task: "",
      }
      const expectedResponse = {
        status: 400,
        body: { message: "Bad input." },
      }
      await handleBusinessRuleTest(invalidSubtaskData, expectedResponse)
    })

    test.only("[400] should reject when no body is provided", async () => {
      const emptysubtaskData = {}
      const expectedResponse = {
        status: 400,
        body: { message: "Bad input." },
      }
      await handleBusinessRuleTest(emptysubtaskData, expectedResponse)
    })

    test.only("[400] should reject when more payload than needed is provided", async () => {
      const excessivePayload = {
        createdAt: new Date().getTime(),
        id: "subtask_19191919",
        isDone: true,
        task: "payload",
        taskId: "taskId",
        randomProp: false,
      }
      const expectedResponse = {
        status: 400,
        body: { message: "Bad input." },
      }
      await handleBusinessRuleTest(excessivePayload, expectedResponse)
    })

    test.only("[400] should reject when text is empty", async () => {
      const subtaskDataEmptyText = {
        isDone: false,
        task: "",
        taskId: "taskid_2020",
      }
      const expectedResponse = {
        status: 400,
        body: { message: "Bad input." },
      }
      await handleBusinessRuleTest(subtaskDataEmptyText, expectedResponse)
    })

    test.only("[201] should create without isDone property being sent on payload", async () => {
      const subtaskData = {
        task: "task data",
        taskId: "taskid_2020",
      }
      const expectedResponse = {
        status: 201,
        body: {
          createdAt: new Date().getTime(),
          id: "subtask_19191919",
          isDone: false,
          task: subtaskData.task,
          taskId: subtaskData.taskId,
        },
      }
      await handleBusinessRuleTest(subtaskData, expectedResponse)
    })
  })

  describe("DELETE method", () => {
    const validUserId = "johndoe"

    const createTaskRequest = (subtaskData?: Record<string, any>) =>
      mockRequest(mockAuthorizationHeader(validUserId), "DELETE", subtaskData)

    test.only("[200] delete", async () => {
      const response = { json: jsonResponse, status: responseStatus } as any
      const request = createTaskRequest({
        subtaskId: "whatever-id",
      }) as any
      await handler(request, response)
      expect(responseStatus).toHaveBeenCalledWith(200)
      expect(jsonResponse).toHaveBeenCalledWith({
        message: "Subtask deleted with success!",
      })
    })
  })
})
