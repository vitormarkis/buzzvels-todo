import { getAuth } from "@/utils/getAuth"
import { mockRequest } from "@/utils/units/mockRequest"

describe("authentication", () => {
  test("should reject the request when no authorization token is provided", async () => {
    const request = mockRequest({}, "POST", {})

    const { isAuth } = getAuth(request as any)
    expect(isAuth).toBeFalsy()
  })

  test("should reject the request when a bad authorization token format is provided", async () => {
    const request = mockRequest({ authorization: "unusual token" }, "POST", {})

    const { isAuth } = getAuth(request as any)
    expect(isAuth).toBeFalsy()
  })

  test("should reject the request when no user id in authorization token is provided", async () => {
    const request = mockRequest({ authorization: "bearer" }, "POST", {})

    const { isAuth } = getAuth(request as any)
    expect(isAuth).toBeFalsy()
  })

  test("should aprove when a valid authorization token is provided", async () => {
    const request = mockRequest({ authorization: "bearer userid" }, "POST", {})

    const { isAuth } = getAuth(request as any)
    expect(isAuth).toBeTruthy()
  })
})
