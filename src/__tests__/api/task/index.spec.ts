import handler from "@/pages/api/test"

jest.mock("nanoid", () => ({
  nanoid: () => "19191919",
}))

describe("/api/tasks", () => {
  describe("authentication", () => {
    const json = jest.fn()
    const status = jest.fn(() => ({
      json,
    }))

    const req = {
      method: "GET",
      body: JSON.stringify({
        name: "Markis",
      }),
    } as any

    const res = {
      status,
    } as any
  })

  const json = jest.fn()
  const status = jest.fn(() => ({
    json,
  }))

  const req = {
    headers: {
      authorization: "xbearer 87482734897283479823",
    },
    method: "GET",
    body: JSON.stringify({
      name: "Markis",
    }),
  } as any

  const res = {
    status,
  } as any

  test("POST", () => {
    handler(req, res)
    const apiResponse = json.mock.calls[0][0]
    expect(status).toHaveBeenCalledWith(200)
    expect(apiResponse).toMatchObject({
      userId: "userid_19191919",
      name: "Your name is Markis",
    })
  })
})
