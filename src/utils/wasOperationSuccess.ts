export function wasOperationSuccess(successResponse: unknown) {
  if (successResponse === 1) return true
  return false
}
