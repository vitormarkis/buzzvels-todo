import { cssVariables } from "@/utils/units/cssVariables"

describe("Create CSS Variables helper function", () => {
  it("should create simple css variable", () => {
    const result = cssVariables(["vitor", 30])

    expect(result).toStrictEqual({ "--vitor": 30 })
  })

  it("should create simple css variable with pxs", () => {
    const result = cssVariables(["vitor", 30, "px"])

    expect(result).toStrictEqual({ "--vitor": "30px" })
  })

  it("should create multiple css variables", () => {
    const result = cssVariables([
      ["clientWidth", 30, "px"],
      ["maxSize", "0"],
      ["maxLength", 0],
      ["averageRange", "30", "rem"],
    ])

    expect(result).toStrictEqual({
      "--clientWidth": "30px",
      "--maxSize": "0",
      "--maxLength": 0,
      "--averageRange": "30rem",
    })
  })

  it("should preserve the value primitive type when no sufix is provided", () => {
    const result = cssVariables([
      ["number", 0],
      ["string", 0, "px"],
    ])

    expect(result).toStrictEqual({
      "--number": 0,
      "--string": "0px",
    })
  })

  it("should create CSS variable handling the wrong prefixes provided", () => {
    const result = cssVariables([
      ["--client", 0],
      ["client", 0],
      ["---client", 0],
      ["-----client", 0],
      ["-client", 0],
    ])

    expect(result).toStrictEqual({
      "--client": 0,
    })
  })
})
