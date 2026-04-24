import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/verify-email",
  "/reset-password",
  "/change-password",
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const url = request.nextUrl.clone()

  const response = NextResponse.next()

  const isLoggedIn =
    request.cookies.has("authToken") || request.cookies.has("userInfo")

  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

  // 🚨 Force `/login?type=email` if user not logged in and hits `/login` without params
  if (!isLoggedIn && path === "/login" && !url.searchParams.has("type")) {
    url.searchParams.set("type", "email")
    return NextResponse.redirect(url)
  }

  if (!isLoggedIn && !isPublicRoute) {
    url.pathname = "/login"
    url.searchParams.set("type", "email")
    return NextResponse.redirect(url)
  }

  if (isLoggedIn && (path === "/login" || path === "/signup")) {
    url.pathname = "/"
    url.searchParams.delete("type")
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
