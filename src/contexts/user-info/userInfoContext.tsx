import React, { createContext, useContext, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/server"

type ComponentWithChildren = {
  children: React.ReactNode
}

export type IUserInfoContext = {
  userId: string | null | undefined
  headers: Headers
}

export const UserInfoContext = createContext({} as IUserInfoContext)

export function UserInfoProvider({ children }: ComponentWithChildren) {
  const { userId } = useAuth()

  const headers = new Headers()
  if (userId) headers.append("Authorization", `Bearer ${userId}`)

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
