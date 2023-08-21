import { nanoid } from "nanoid"

export function generateUserId() {
  return `userid_${nanoid()}`
}
