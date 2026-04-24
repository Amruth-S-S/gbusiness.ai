"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast"
import { authService, type SendOTPRequest } from "@/services"

const forgotPasswordSchema = z
  .object({
    identifier: z.string().min(1, "Email or phone number is required"),
    identifier_type: z.enum(["EMAIL", "PHONE"]),
  })
  .refine(
    (data) => {
      if (data.identifier_type === "EMAIL") {
        return z.string().email().safeParse(data.identifier).success
      }
      if (data.identifier_type === "PHONE") {
        return /^[6-9][0-9]{9}$/.test(data.identifier)
      }
      return false
    },
    {
      message: "Please enter a valid email address or phone number",
      path: ["identifier"],
    },
  )

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

interface UseForgotPasswordFormProps {
  redirectToOtp?: boolean
  onOTPSent?: (payload: SendOTPRequest) => void
}

export function useForgotPasswordForm({
  redirectToOtp = true,
  onOTPSent,
}: UseForgotPasswordFormProps) {
  const router = useRouter()
  const [isSending, setIsSending] = useState(false)

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
      identifier_type: "EMAIL",
    },
    mode: "onChange",
  })

  const handleIdentifierTypeChange = (type: "EMAIL" | "PHONE") => {
    form.setValue("identifier_type", type)
    form.setValue("identifier", "")
  }

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsSending(true)

    try {
      const payload: SendOTPRequest = {
        identifier: data.identifier,
        identifier_type: data.identifier_type,
        purpose: "RESET_PASSWORD",
      }

      const response = await authService.sendOTP(payload)

      if (response.data?.success) {
        toast.success("OTP sent successfully!")

        if (onOTPSent) onOTPSent(payload)

        if (redirectToOtp) {
          router.push(
            `/verify-otp?identifier=${encodeURIComponent(
              data.identifier,
            )}&identifier_type=${data.identifier_type}&purpose=RESET_PASSWORD`,
          )
        }
      } else {
        const errorMessage = response.errRes || "Failed to send OTP"
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Send OTP error:", error)
    } finally {
      setIsSending(false)
    }
  }

  return {
    form,
    isSending,
    onSubmit,
    handleIdentifierTypeChange,
  }
}
