import { useAuth } from "@/contexts/auth-context"
import { languageOptions } from "@/lib/languages"
import { post } from "@/services/utils"
import { useLanguagesStore } from "@/store/languages"
import { useUserStore } from "@/store/user"
import { zodResolver } from "@hookform/resolvers/zod"
import Cookies from "js-cookie"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"

function extractValues(input: any): string {
  let result = ""
  function recursiveExtract(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach((element) => recursiveExtract(element))
    } else if (typeof obj === "object" && obj !== null) {
      Object.values(obj).forEach((value) => recursiveExtract(value))
    } else {
      result += `${obj?.toString()}`
    }
  }
  recursiveExtract(input)
  return result.trim()
}

const mobileRegExp = /^[6-9][0-9]{9}$/
const otpRegExp = /^[0-9]{4}$/

const mobileLoginFormSchema = z.object({
  mobile: z
    .string({ required_error: "Mobile Number is required" })
    .trim()
    .length(10, "Mobile Number must be exactly 10 digits")
    .regex(mobileRegExp, "Invalid Mobile Number format"),
  language: z
    .string({ required_error: "Language is required" })
    .min(1, "Language is required"),
})

const mobileWithOTPLoginFormSchema = z.object({
  mobile: z
    .string({ required_error: "Mobile Number is required" })
    .trim()
    .length(10, "Mobile Number must be exactly 10 digits")
    .regex(mobileRegExp, "Invalid Mobile Number format"),
  otp: z
    .string({ required_error: "OTP is required" })
    .trim()
    .length(4, "OTP must be exactly 4 digits")
    .regex(otpRegExp, "Invalid OTP format"),
})

type MobileLoginFormValues = z.infer<typeof mobileLoginFormSchema>
type MobileWithOTPLoginFormValues = z.infer<typeof mobileWithOTPLoginFormSchema>

export function useMobileLoginForm() {
  const { isAuthenticated } = useAuth()
  const { updateLanguagesStore } = useLanguagesStore()
  const { updateUserStore } = useUserStore()
  const pathName = usePathname()
  const router = useRouter()

  const [mobileLoginFormState, setMobileLoginFormState] = useState({
    otpRequested: false,
    mobile: "",
  })

  const [sendingOtp, setSendingOtp] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const form = useForm<MobileLoginFormValues>({
    resolver: zodResolver(mobileLoginFormSchema),
    defaultValues: {
      mobile: "",
      language: languageOptions[0].value,
    },
    mode: "onTouched",
  })

  const mobileNumberWithOTPForm = useForm<MobileWithOTPLoginFormValues>({
    resolver: zodResolver(mobileWithOTPLoginFormSchema),
    defaultValues: {
      mobile: "",
      otp: "",
    },
  })

  // Sync mobile into OTP form
  useEffect(() => {
    if (mobileLoginFormState.otpRequested) {
      mobileNumberWithOTPForm.setValue("mobile", mobileLoginFormState.mobile)
    }
  }, [mobileLoginFormState.otpRequested])

  // Auto-redirect if already logged in
  useEffect(() => {
    if (pathName === "/login" && isAuthenticated) {
      router.push("/")
    }
  }, [pathName, isAuthenticated])

  // Resend OTP cooldown logic
  useEffect(() => {
    let timer: undefined | ReturnType<typeof setTimeout>
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendCooldown])

  async function onSubmit(
    data: MobileLoginFormValues | MobileWithOTPLoginFormValues,
  ) {
    try {
      if (!mobileLoginFormState.otpRequested) {
        const payload = {
          phone_number: `91${data.mobile}`,
        }
        setSendingOtp(true)
        post("/client-users/send-otp", payload)
          .then(() => {
            updateLanguagesStore({
              selectedLang: (data as MobileLoginFormValues).language,
            })
            setMobileLoginFormState({ mobile: data.mobile, otpRequested: true })
            setResendCooldown(30)
          })
          .catch((err) => {
            toast.error(
              extractValues(err?.response?.data) || "Something went wrong",
              {
                position: "top-right",
              },
            )
          })
          .finally(() => setSendingOtp(false))
      } else {
        const payload = {
          phone_number: `91${mobileLoginFormState.mobile}`,
          otp: (data as MobileWithOTPLoginFormValues).otp,
        }
        post("/client-users/verify-otp", payload)
          .then((response: any) => {
            const res = response.data
            const userInfo = {
              accessToken: res.access_token,
              userId: res.user_id,
              role: res.role?.toUpperCase() ?? "END_USER",
              userName: res.user_name,
              email: res.email,
              subscription: res.subscription,
              customerOtherDetails: res.customer_other_details,
            }
            updateUserStore({ isLoading: false, data: userInfo, error: null })
            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            Cookies.set("userInfo", JSON.stringify(userInfo), { path: "/" })
            router.push("/", { scroll: false })
          })
          .catch((err) => {
            toast.error(
              extractValues(err?.response?.data) || "Something went wrong",
              {
                position: "top-right",
              },
            )
          })
      }
      // eslint-disable-next-line unused-imports/no-unused-vars
    } catch (error) {
      toast.error("An error occurred while logging in. Please try again.")
    }
  }

  const handleResendOtp = () => {
    if (resendCooldown === 0) {
      onSubmit({ mobile: mobileLoginFormState.mobile, language: "" })
    }
  }

  const handleBackToMobileInput = () => {
    setMobileLoginFormState({ otpRequested: false, mobile: "" })
    form.setValue("mobile", "")
  }

  return {
    mobileNumberForm: form,
    mobileNumberWithOTPForm,
    mobileLoginFormState,
    resendCooldown,
    sendingOtp,
    isLoading: form.formState.isSubmitting,
    onSubmit,
    handleResendOtp,
    handleBackToMobileInput,
  }
}
