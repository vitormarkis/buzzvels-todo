import React, { createContext, useContext, useState } from "react"

type ComponentWithChildren = {
  children: React.ReactNode
}

export type IUserInfoContext = {
  userId: string | null
  setUserId: React.Dispatch<React.SetStateAction<string | null>>
  headers: Headers
}

export const UserInfoContext = createContext({} as IUserInfoContext)

export function UserInfoProvider({
  children,
  userId: userIdProp,
}: ComponentWithChildren & Pick<IUserInfoContext, "userId">) {
  const [userId, setUserId] = useState(userIdProp)

  const headers = new Headers()
  if (userId) headers.append("Authorization", `Bearer ${userId}`)

  return (
    <UserInfoContext.Provider
      value={{
        userId,
        setUserId,
        headers,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  )
}

export const useUserInfo = () => useContext(UserInfoContext)
