import { authMiddleware } from "@clerk/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getAuth } from "@clerk/nextjs/server"

export default authMiddleware({
  publicRoutes: ["/"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
