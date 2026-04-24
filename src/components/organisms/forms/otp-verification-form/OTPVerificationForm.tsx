import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { OTPInput } from "@/components/atoms/controls/OTPInput"
import { CountdownTimer } from "@/components/atoms/controls/CountdownTimer"
import { Paragraph } from "@/components/atoms/texts"
import { toast } from "react-hot-toast"
import { ApiResponse } from "@/services/utils"
import {
  authService,
  LoginWithOTPRequest,
  SendOTPRequest,
  StandardResponse,
  VerifyOTPRequest,
} from "@/services"

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "Please enter the complete OTP")
    .max(6, "OTP must be 6 digits"),
})

interface OTPVerificationFormProps {
  identifier: string
  identifierType: "EMAIL" | "PHONE"
  purpose: "RESET_PASSWORD" | "CHANGE_PASSWORD" | "VERIFY_EMAIL" | "LOGIN"
  onSuccess: (data: any) => void
  onBack?: () => void
  className?: string
  password?: string
}

export function OTPVerificationForm({
  identifier,
  identifierType,
  purpose,
  onSuccess,
  onBack,
  className,
  password,
}: OTPVerificationFormProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(30)
  const [otpExpired, setOtpExpired] = useState(false)

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  // Start resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const onSubmit = async (data: z.infer<typeof otpSchema>) => {
    setIsVerifying(true)

    try {
      let response: ApiResponse<StandardResponse> | null = null

      if (purpose === "LOGIN") {
        const payload: LoginWithOTPRequest = {
          identifier,
          identifier_type: identifierType,
          otp_code: data.otp,
        }

        const res = await authService.loginWithOTP(payload)

        if (res.data?.access_token) {
          onSuccess(res.data)
          return
        }

        const errorMessage = res.errRes || "Login failed"
        toast.error(errorMessage)

        if (errorMessage.includes("expired")) {
          setOtpExpired(true)
        }
        return
      }

      // Non-LOGIN purposes
      if (purpose === "VERIFY_EMAIL") {
        response = await authService.verifyEmail({
          email: identifier,
          otp_code: data.otp,
        })
      } else {
        onSuccess({
          identifier,
          otpCode: data.otp,
          purpose,
          identifier_type: identifierType,
        })
      }

      if (purpose !== "CHANGE_PASSWORD" && purpose !== "RESET_PASSWORD") {
        if (response?.data?.success) {
          toast.success("OTP verified successfully!")
          onSuccess({ ...response.data, otpCode: data.otp })
        } else {
          const errorMessage = (response?.errRes as { detail?: string })?.detail
          toast.error(response?.data?.message ?? "OTP verification failed")

          if (errorMessage?.includes("expired")) {
            setOtpExpired(true)
          }
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("OTP verification error:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)

    try {
      const payload: SendOTPRequest = {
        identifier,
        identifier_type: identifierType,
        purpose,
        password,
      }

      let response: ApiResponse<StandardResponse>

      if (purpose === "VERIFY_EMAIL") {
        response = await authService.sendEmailVerification(identifier)
      } else {
        response = await authService.sendOTP(payload)
      }

      if (response.data?.success) {
        toast.success("OTP sent successfully!")
        setResendCooldown(60) // 60 seconds cooldown
        setOtpExpired(false)
        form.reset()
      } else {
        toast.error("OTP verification failed")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Resend OTP error:", error)
    } finally {
      setIsResending(false)
    }
  }

  const handleOTPComplete = (otp: string) => {
    form.setValue("otp", otp)
    form.handleSubmit(onSubmit)()
  }

  const getPurposeText = () => {
    switch (purpose) {
      case "RESET_PASSWORD":
        return "to reset your password"
      case "CHANGE_PASSWORD":
        return "to change your password"
      case "VERIFY_EMAIL":
        return "to verify your email"
      default:
        return null
    }
  }

  const getIdentifierDisplay = () => {
    if (identifierType === "EMAIL") {
      return identifier
    }
    // For phone numbers, you might want to mask some digits
    return identifier.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2")
  }

  const identifierDisplay = getIdentifierDisplay()
  const purposeText = getPurposeText()

  return (
    <div className={className}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Verify OTP
        </h2>
        <Paragraph className="text-gray-600">
          We&apos;ve sent a 6-digit OTP to {identifierDisplay}
          {purposeText && ` ${purposeText}`}
        </Paragraph>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OTPInput
                    value={field.value}
                    onChange={field.onChange}
                    onComplete={handleOTPComplete}
                    disabled={isVerifying}
                    autoFocus
                    className="justify-center"
                  />
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />

          {otpExpired && (
            <div className="text-center">
              <Paragraph className="text-red-600 text-sm">
                OTP has expired. Please request a new one.
              </Paragraph>
            </div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl"
              disabled={!form.formState.isValid || isVerifying}
              isLoading={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isResending}
                className="text-primary disabled:opacity-50"
              >
                {isResending ? (
                  "Sending..."
                ) : resendCooldown > 0 ? (
                  <>
                    Resend OTP in
                    <CountdownTimer
                      duration={resendCooldown}
                      onComplete={() => setResendCooldown(0)}
                    />
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>

              {onBack && (
                <div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onBack}
                    disabled={isVerifying || isResending}
                    className="text-gray-600"
                  >
                    Back
                  </Button>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
