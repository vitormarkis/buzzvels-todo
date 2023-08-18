import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { authMiddleware } from "@clerk/nextjs"
import { getAuth } from "@clerk/nextjs/server"

export default authMiddleware({
  publicRoutes: ["/", "/(api|trpc)(.*)"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
