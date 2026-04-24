"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { authService } from "@/services"

export interface AuthUser {
  userId: number
  userName: string
  email: string
  role: string
  subscription: string
  trialEndDate: string | null
  isTrialActive: boolean
  accessToken?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: AuthUser) => void
  logout: () => void
  refreshUser: () => Promise<void>
  updateUser: (updates: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  // 🔑 Initialize auth state from cookies only
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const cookieToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("auth_token="))
          ?.split("=")[1]

        const cookieUser = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userInfo="))
          ?.split("=")[1]

        if (cookieUser && cookieToken) {
          const userData = JSON.parse(decodeURIComponent(cookieUser))
          setUser({ ...userData, accessToken: cookieToken })

          // Verify token validity
          await refreshUser()
        }
      } catch (error) {
        console.error("Auth initialization error:", error)

        // Clear invalid cookies
        document.cookie =
          "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie =
          "userInfo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // 🔑 Login: set state + cookies
  const login = (data: AuthUser) => {
    const userData: AuthUser = {
      userId: data.userId,
      userName: data.userName,
      email: data.email,
      role: data.role,
      subscription: data.subscription,
      trialEndDate: data.trialEndDate,
      isTrialActive: data.isTrialActive,
      accessToken: data.accessToken,
    }

    setUser(userData)

    // Store in cookies (24h expiry)
    document.cookie = `auth_token=${data.accessToken}; path=/; max-age=${
      60 * 60 * 24
    }`
    document.cookie = `userInfo=${encodeURIComponent(
      JSON.stringify(userData),
    )}; path=/; max-age=${60 * 60 * 24}`

    toast.success(`Welcome back, ${data.userName}!`)
  }

  // 🔑 Logout: clear state + cookies
  const logout = () => {
    setUser(null)

    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "userInfo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    toast.success("Logged out successfully")
    router.push("/login")
  }

  // 🔑 Refresh user: re-fetch from API
  const refreshUser = async () => {
    if (!user?.email) return

    try {
      const response = await authService.getUserStatus(user.email, "EMAIL")

      if (response.data) {
        const userData: AuthUser = {
          ...user,
          userId: response.data.userId,
          email: response.data.email,
          subscription: response.data.subscription,
          trialEndDate: response.data.trialEndDate,
        }

        setUser(userData)

        // Update cookies with refreshed data
        document.cookie = `userInfo=${encodeURIComponent(
          JSON.stringify(userData),
        )}; path=/; max-age=${60 * 60 * 24}`
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error)
      logout() // token might be invalid
    }
  }

  // 🔑 Update partial user fields
  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)

    // Sync cookie
    document.cookie = `userInfo=${encodeURIComponent(
      JSON.stringify(updatedUser),
    )}; path=/; max-age=${60 * 60 * 24}`
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
