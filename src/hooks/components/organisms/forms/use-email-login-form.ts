import { useAuth } from "@/contexts/auth-context"
import { languageOptions } from "@/lib/languages"
import { convertBodyToCamelCaseFromSnake, passwordRules } from "@/lib/utils"
import { type AuthResponse, authService, type SendOTPRequest } from "@/services"
import { useLanguagesStore } from "@/store/languages"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

const passwordField = passwordRules.reduce(
  (schema, rule) => schema.refine(rule.test, { message: rule.message }),
  z.string() as z.ZodType<string>,
)

const emailLoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .max(32, { message: "Email must not exceed 32 characters." })
    .email("Enter a valid email address.")
    .refine((email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email), {
      message: "Email must have a valid domain and TLD.",
    }),
  password: passwordField,
  language: z
    .string({ required_error: "Language is required" })
    .min(1, "Language is required"),
})

type EmailLoginFormValues = z.infer<typeof emailLoginFormSchema>

export function useEmailLoginForm() {
  const { isAuthenticated } = useAuth()
  const { updateLanguagesStore } = useLanguagesStore()
  const { login: authLogin } = useAuth()
  const router = useRouter()
  const [isSendingOTP, setIsSendingOTP] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const defaultValues: Partial<EmailLoginFormValues> = {
    email: "",
    password: "",
    language: languageOptions[0].value,
  }

  const form = useForm<EmailLoginFormValues>({
    resolver: zodResolver(emailLoginFormSchema),
    defaultValues,
    mode: "onTouched",
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [router, isAuthenticated])

  // const onSubmit = async (data: EmailLoginFormValues) => {
  //   try {
  //     setIsSendingOTP(true)
  //     setEmail(data.email)

  //     const url = new URL("client-users/login", baseUrl)
  //     const { data: res, error } = await fetchWrapper<User>(url.href, {
  //       method: "POST",
  //       body: data,
  //     })

  //     if (res) {
  //       const response = convertBodyToCamelCaseFromSnake<User>(res)
  //       const userInfo: User = {
  //         accessToken: response.accessToken,
  //         userId: response.userId,
  //         role: (response.role?.toUpperCase() as User["role"]) ?? "END_USER",
  //         userName: response.userName,
  //         email: response.email,
  //         subscription: response.subscription,
  //         customerOtherDetails: response.customerOtherDetails,
  //       }

  //       updateLanguagesStore({ selectedLang: data.language })
  //       updateUserStore({ isLoading: false, data: userInfo, error: null })
  //       localStorage.setItem("userInfo", JSON.stringify(userInfo))
  //       Cookies.set("userInfo", JSON.stringify(userInfo), { path: "/" })
  //       router.push("/", { scroll: false })
  //     } else if (error && typeof error === "object") {
  //       iterateErrorResponse(error as Record<string, any>)
  //     }
  //     // eslint-disable-next-line unused-imports/no-unused-vars
  //   } catch (error) {
  //     toast.error("An error occurred while logging in. Please try again.")
  //   }
  // }

  const onSubmit = async (data: EmailLoginFormValues) => {
    try {
      setIsSendingOTP(true)
      setEmail(data.email)
      setPassword(data.password)

      updateLanguagesStore({ selectedLang: data.language })

      const payload: SendOTPRequest = {
        identifier: data.email,
        identifier_type: "EMAIL",
        purpose: "LOGIN",
        password: data.password,
      }

      const response = await authService.sendOTP(payload)

      if (response.data?.success) {
        toast.success("OTP sent successfully to your email!")
        setOtpSent(true)
      } else {
        const errorMessage = response.errRes || "Failed to send OTP"
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Login error:", error)
    } finally {
      setIsSendingOTP(false)
    }
  }

  const handleOTPSuccess = (data: AuthResponse) => {
    authLogin(convertBodyToCamelCaseFromSnake(data))

    if (data.role === "CONSULTANT" || data.role === "ADMIN") {
      router.push("/consultant")
    } else if (data.role === "CXO") {
      router.push("/cxo")
    } else {
      router.push("/")
    }
  }

  const handleBackToEmail = () => {
    setOtpSent(false)
    setEmail("")
    form.reset()
  }

  return {
    form,
    onSubmit,
    isLoading: form.formState.isSubmitting,
    otpSent,
    email,
    isSendingOTP,
    handleOTPSuccess,
    handleBackToEmail,
    password,
  }
}
