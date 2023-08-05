import React, { createContext, useContext } from "react"

type ComponentWithChildren = {
  children: React.ReactNode
}

export type IUserInfoContext = {
  userId: string | null
  headers: Headers
}

export const UserInfoContext = createContext({} as IUserInfoContext)

export function UserInfoProvider({ children, userId }: ComponentWithChildren & IUserInfoContext) {
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${userId}`)

  return (
    <UserInfoContext.Provider
      value={{
        userId,
        headers,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  )
}

export const useUserInfo = () => useContext(UserInfoContext)
