export function validateOperation<T extends { errors: unknown[] }>(
  operation: T
): {
  operationSuccess: boolean
} {
  const operationSuccess = operation.errors.length === 0

  return {
    operationSuccess,
  }
}
