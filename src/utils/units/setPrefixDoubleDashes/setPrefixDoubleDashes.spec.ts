import { setPrefixDoubleDashes } from "@/utils/units/setPrefixDoubleDashes"

describe("Set double dashes in the start of any string passed", () => {
  it("should set double dashes in the start of the string even not providing any prefixes to argument string", () => {
    const result = setPrefixDoubleDashes("example-demo")
    expect(result).toBe("--example-demo")
  })
  it("should set double dashes in the start of the string providing only one dash as prefix to argument string", () => {
    const result = setPrefixDoubleDashes("-example-demo")
    expect(result).toBe("--example-demo")
  })
  it("should set double dashes in the start of the string providing three dashes as prefix to argument string", () => {
    const result = setPrefixDoubleDashes("---example-demo")
    expect(result).toBe("--example-demo")
  })
  it("should set double dashes in the start of the string providing multiple dashes as prefix to argument string", () => {
    const result = setPrefixDoubleDashes("----example-demo")
    expect(result).toBe("--example-demo")
  })
})
