import { NextApiRequest } from "next"

import { getFailedJson } from "@/utils/getFailedJson"

export function handleOperationsSuccess(
  name: string,
  req: NextApiRequest,
  operations: number[]
): HandleOperationsSuccess {
  const operationSuccess = operations.every(res => res === 0)

  if (!operationSuccess) {
    const json = getFailedJson(name, req)

    return {
      success: false,
      json,
    }
  }
  return {
    success: true,
  }
}

export type HandleOperationsSuccess =
  | {
      success: false
      json: {
        message: string
      }
    }
  | {
      success: true
    }
