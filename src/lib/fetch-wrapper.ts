import toast from "react-hot-toast"
import { convertBodyToSnakeCase, removeFromCookie } from "./utils"

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"

interface FetchOptions {
  method: HttpMethod
  headers?: Record<string, string>
  body?: any
}

interface ApiResponse<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
}

const isObject = (body: any): boolean =>
  body && typeof body === "object" && !Array.isArray(body)

// Simple cookie getter
function getFromCookie(key: string): string | null {
  const name = `${key}=`
  const decodedCookie = decodeURIComponent(document.cookie)
  const cookies = decodedCookie.split(";")
  for (let c of cookies) {
    c = c.trim()
    if (c.startsWith(name)) {
      return c.substring(name.length)
    }
  }
  return null
}

export async function fetchWrapper<T>(
  url: string,
  options: FetchOptions,
): Promise<ApiResponse<T>> {
  let isLoading = true
  let error: Error | null = null
  let data: T | null = null

  let userId: string | null = null
  const raw = getFromCookie("userInfo")
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      userId = parsed.userId
    } catch {
      // invalid JSON—just ignore
    }
  }

  const urlObj = new URL(url, window.location.origin)

  if (!urlObj.pathname.startsWith("/client-users") && userId) {
    urlObj.searchParams.set("user_id", userId)
  }

  try {
    const { method, headers, body } = options

    const transformedBody =
      !(body instanceof FormData) && isObject(body)
        ? JSON.stringify(convertBodyToSnakeCase(body))
        : body

    const response = await fetch(urlObj.href, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: transformedBody,
    })

    if (!response.ok) {
      const err = (await response.json()) as { detail: string }
      if (err && err.detail) {
        if (err.detail.toLowerCase().includes("expire")) {
          toast.error(err.detail, { position: "top-right" })
          const logout = () => {
            localStorage.clear()
            sessionStorage.clear()
            removeFromCookie("userInfo")
            window.location.href = "/login?type=email"
          }

          logout()
        } else {
          throw new Error(err.detail)
        }
      }
    }

    data = await response.json()
  } catch (err) {
    error = err instanceof Error ? err : new Error(String(err))
  } finally {
    isLoading = false
  }

  return { data, isLoading, error }
}
