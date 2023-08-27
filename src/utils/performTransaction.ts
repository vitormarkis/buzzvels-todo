export const performOperation = async <T extends any>(operation: () => Promise<T>) => {
  try {
    await operation()
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
