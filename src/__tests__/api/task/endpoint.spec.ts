import handler from "@/pages/api/task"

jest.useFakeTimers().setSystemTime(new Date("2023-01-01"))

jest.mock("@/lib/redis", () => ({
  redis: {
    rpush: jest.fn(async () => {}),
    hset: jest.fn(async () => {}),
  },
}))

jest.mock("nanoid", () => ({
  nanoid: () => "19191919",
}))

describe("/api/tasks", () => {
  describe("POST method", () => {
    describe("authentication", () => {
      const json = jest.fn()
      const status = jest.fn(() => ({
        json,
      }))

      const request_noAuthorization = {
        headers: {},
        method: "POST",
        body: JSON.stringify({}),
      } as any

      const request_badAuthorizationTokenFormat = {
        headers: {
          authorization: "unusual token",
        },
        method: "POST",
        body: JSON.stringify({}),
      } as any

      const request_noUserIdInAuthorizationToken = {
        headers: {
          authorization: "bearer",
        },
        method: "POST",
        body: JSON.stringify({}),
      } as any

      const res = {
        status,
      } as any

      test("should reject the request when no authorization token is provided", async () => {
        jest.clearAllMocks()
        await handler(request_noAuthorization, res)
        expect(status).toHaveBeenCalledTimes(1)
        expect(status).toHaveBeenCalledWith(401)
      })

      test("should reject the request when a bad authorization token format is provided", async () => {
        jest.clearAllMocks()
        await handler(request_badAuthorizationTokenFormat, res)
        expect(status).toHaveBeenCalledTimes(1)
        expect(status).toHaveBeenCalledWith(401)
      })

      test("should reject the request when no user id in authorization token is provided", async () => {
        jest.clearAllMocks()
        await handler(request_noUserIdInAuthorizationToken, res)
        expect(status).toHaveBeenCalledTimes(1)
        expect(status).toHaveBeenCalledWith(401)
      })
    })

    describe("business rule", () => {
      test("[201] should create and return a new task", async () => {
        const req = {
          headers: {
            authorization: "bearer userid_johndoe",
          },
          method: "POST",
          body: JSON.stringify({
            endDate: 1692748541936,
            task: "task number",
          }),
        } as any

        const json = jest.fn()
        const status = jest.fn(() => ({
          json,
        }))

        const res = {
          status,
        } as any

        await handler(req, res)
        const apiResponse = json.mock.calls[0][0]
        expect(status).toHaveBeenCalledWith(201)
        expect(apiResponse).toMatchObject({
          endDate: 1692748541936,
          isDone: false,
          task: "task number",
          createdAt: 1672531200000,
          id: "task_19191919",
        })
      })
      test("[400] should reject when bad input", async () => {
        const req = {
          headers: {
            authorization: "bearer userid_johndoe",
          },
          method: "POST",
          body: JSON.stringify({
            task: "",
          }),
        } as any

        const json = jest.fn()
        const status = jest.fn(() => ({
          json,
        }))

        const res = {
          status,
        } as any

        await handler(req, res)
        const apiResponse = json.mock.calls[0][0]
        expect(status).toHaveBeenCalledWith(400)
        expect(apiResponse.message).toBe("Bad input.")
      })
      test("[400] should reject when no body is provided", async () => {
        const req = {
          headers: {
            authorization: "bearer userid_johndoe",
          },
          method: "POST",
          body: "{}",
        } as any

        const json = jest.fn()
        const status = jest.fn(() => ({
          json,
        }))

        const res = {
          status,
        } as any

        await handler(req, res)
        const apiResponse = json.mock.calls[0][0]
        expect(status).toHaveBeenCalledWith(400)
        expect(apiResponse.message).toBe("Bad input.")
      })
      test("[400] should reject when more payload than needed is provided", async () => {
        const req = {
          headers: {
            authorization: "bearer userid_johndoe",
          },
          method: "POST",
          body: JSON.stringify({
            endDate: null,
            isDone: false,
            task: "task number",
            createdAt: 1672531200000,
            id: "task_19191919",
          }),
        } as any

        const json = jest.fn()
        const status = jest.fn(() => ({
          json,
        }))

        const res = {
          status,
        } as any

        await handler(req, res)
        const apiResponse = json.mock.calls[0][0]
        expect(status).toHaveBeenCalledWith(400)
        expect(apiResponse.message).toBe("Bad input.")
      })
      test("[201] should create when end date is null", async () => {
        const req = {
          headers: {
            authorization: "bearer userid_johndoe",
          },
          method: "POST",
          body: JSON.stringify({
            endDate: null,
            task: "task number",
          }),
        } as any

        const json = jest.fn()
        const status = jest.fn(() => ({
          json,
        }))

        const res = {
          status,
        } as any

        await handler(req, res)
        const apiResponse = json.mock.calls[0][0]
        console.log(apiResponse)
        expect(status).toHaveBeenCalledWith(201)
        expect(apiResponse).toMatchObject({
          endDate: null,
          isDone: false,
          task: "task number",
          createdAt: 1672531200000,
          id: "task_19191919",
        })
      })
    })
  })
})
