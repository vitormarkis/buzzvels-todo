export const mockRequest = (
  headers: Record<string, string>,
  method: string,
  body: Record<string, any> = {}
) => ({
  headers,
  method,
  body: JSON.stringify(body),
})
