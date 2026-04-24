import { type AuthUser } from "@/contexts/auth-context"
import { type ApiResponse, get, post } from "./utils"

export interface SendOTPRequest {
  identifier: string
  identifier_type: "EMAIL" | "PHONE"
  purpose: "LOGIN" | "RESET_PASSWORD" | "CHANGE_PASSWORD" | "VERIFY_EMAIL"
  password?: string
}

export interface VerifyOTPRequest {
  identifier: string
  otp_code: string
  purpose: "RESET_PASSWORD" | "CHANGE_PASSWORD" | "VERIFY_EMAIL"
  identifier_type: "EMAIL" | "PHONE"
}

export interface LoginWithOTPRequest {
  identifier: string
  identifier_type: "EMAIL" | "PHONE"
  otp_code: string
}

export interface ResetPasswordRequest {
  identifier: string
  identifier_type: "EMAIL" | "PHONE"
  otp_code: string
  new_password: string
}

export interface ChangePasswordRequest {
  identifier: string
  identifier_type: "EMAIL" | "PHONE"
  current_password: string
  new_password: string
  otp_code: string
}

export interface VerifyEmailRequest {
  email: string
  otp_code: string
}

export interface AuthResponse {
  access_token: string
  user_id: number
  user_name: string
  email: string
  role: string
  subscription: string
  trial_end_date: string | null
  is_trial_active: boolean
}

export interface StandardResponse {
  success: boolean
  message: string
  data?: any
}

const login = (payload: any): Promise<ApiResponse<any>> =>
  post("/client-users/login", payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

const signup = (payload: any): Promise<ApiResponse<any>> =>
  post("/client-users/", payload)
    .then((res) => {
      const data = res && res.data
      return { data }
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      return { errRes }
    })

export const authService = {
  // Login
  login: async (payload: any): Promise<ApiResponse<StandardResponse>> =>
    post("/client-users/login", payload)
      .then((res) => {
        const data = res && res.data
        return { data }
      })
      .catch((err) => {
        const errRes = err?.response?.data || "Something went wrong"
        return { errRes }
      }),
  // Signup
  signup: async (payload: any): Promise<ApiResponse<StandardResponse>> =>
    post("/client-users/", payload)
      .then((res) => {
        const data = res && res.data
        return { data }
      })
      .catch((err) => {
        const errRes = err?.response?.data || "Something went wrong"
        return { errRes }
      }),
  // Send OTP for various purposes
  sendOTP: async (
    payload: SendOTPRequest,
  ): Promise<ApiResponse<StandardResponse>> =>
    post("/auth/send-otp", payload)
      .then((res) => ({ data: res.data }))
      .catch((err) => ({
        errRes: err?.response?.data || "Failed to send OTP",
      })),

  // Verify OTP for non-login actions
  verifyOTP: async (
    payload: VerifyOTPRequest,
  ): Promise<ApiResponse<StandardResponse>> =>
    post("/auth/verify-otp", payload)
      .then((res) => ({ data: res.data }))
      .catch((err) => ({
        errRes: err?.response?.data || "Failed to verify OTP",
      })),

  // Login with OTP
  loginWithOTP: async (
    payload: LoginWithOTPRequest,
  ): Promise<ApiResponse<AuthResponse>> =>
    post("/auth/login-with-otp", payload)
      .then((res) => ({ data: res.data }))
      .catch((err) => ({ errRes: err?.response?.data || "Login failed" })),

  // Reset password
  resetPassword: async (
    payload: ResetPasswordRequest,
  ): Promise<ApiResponse<StandardResponse>> =>
    post("/auth/reset-password", payload)
      .then((res) => ({ data: res.data }))
      .catch((err) => ({
        errRes: err?.response?.data || "Password reset failed",
      })),

  // Change password
  changePassword: async (
    payload: ChangePasswordRequest,
  ): Promise<ApiResponse<StandardResponse>> =>
    post("/auth/change-password", payload)
      .then((res) => ({ data: res.data }))
      .catch((err) => ({
        errRes: err?.response?.data || "Password change failed",
      })),

  // Send email verification
  sendEmailVerification: async (
    email: string,
  ): Promise<ApiResponse<StandardResponse>> =>
    post(`/auth/send-email-verification?email=${email}`)
      .then((res) => ({ data: res.data }))
      .catch((err) => ({
        errRes: err?.response?.data || "Failed to send email verification",
      })),

  // Verify email
  verifyEmail: async (
    payload: VerifyEmailRequest,
  ): Promise<ApiResponse<StandardResponse>> =>
    post(
      `/auth/verify-email?email=${payload.email}&otp_code=${payload.otp_code}`,
    )
      .then((res) => ({ data: res.data }))
      .catch((err) => ({
        errRes: err?.response?.data || "Email verification failed",
      })),

  // Get user status
  getUserStatus: async (
    identifier: string,
    identifierType: "EMAIL" | "PHONE",
  ): Promise<ApiResponse<AuthUser>> =>
    get(`/auth/user-status/${identifier}?identifier_type=${identifierType}`)
      .then((res) => ({ data: res.data }))
      .catch((err) => ({
        errRes: err?.response?.data || "Failed to get user status",
      })),

  // Legacy OTP endpoint
  sendOTPLegacy: async (
    phoneNumber: string,
  ): Promise<ApiResponse<StandardResponse>> =>
    post(
      `/auth/send-otp-legacy?phone_number=${encodeURIComponent(phoneNumber)}`,
    )
      .then((res) => ({ data: res.data }))
      .catch((err) => ({
        errRes: err?.response?.data || "Failed to send OTP",
      })),
}

export { login, signup }

export default authService
