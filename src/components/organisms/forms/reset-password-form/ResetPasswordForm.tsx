"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Paragraph } from "@/components/atoms/texts"
import { toast } from "react-hot-toast"
import { authService, ResetPasswordRequest } from "@/services"
import { ResetPasswordFormProps } from "./DynamicResetPasswordForm"
import { InputField } from "@/components/molecules/fields/InputField"
import { passwordRules } from "@/lib/utils"
import { MdInfo } from "react-icons/md"

const passwordField = passwordRules.reduce(
  (schema, rule) => schema.refine(rule.test, { message: rule.message }),
  z.string() as z.ZodType<string>,
)

const resetPasswordSchema = z
  .object({
    new_password: passwordField,
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  })

export function ResetPasswordForm({
  identifier,
  identifierType,
  otpCode = "000000",
  onSuccess,
}: ResetPasswordFormProps) {
  const router = useRouter()
  const [isResetting, setIsResetting] = useState(false)

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
    mode: "onChange",
  })

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    setIsResetting(true)

    try {
      const payload: ResetPasswordRequest = {
        identifier,
        identifier_type: identifierType,
        otp_code: otpCode,
        new_password: data.new_password,
      }

      const response = await authService.resetPassword(payload)

      if (response.data?.success) {
        toast.success("Password reset successfully!")
        if (onSuccess) {
          onSuccess()
        } else {
          router.push("/login?reset=true")
        }
      } else {
        const errorMessage = response.errRes || "Password reset failed"
        toast.error(errorMessage)
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Password reset error:", error)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="w-full lg:max-w-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Reset Password
        </h2>
        <Paragraph className="text-gray-600">
          Enter your new password below
        </Paragraph>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            fieldName="new_password"
            control={form.control}
            label="New Password"
            placeholder="Enter new password"
            inputType="password"
            popoverTrigger={<MdInfo size={16} />}
            popoverContent={
              <ul className="text-sm space-y-1">
                {passwordRules.map((rule, index) => (
                  <li key={index} className="text-gray-200">
                    • {rule.message}
                  </li>
                ))}
              </ul>
            }
          />

          <InputField
            fieldName="confirm_password"
            control={form.control}
            label="Confirm Password"
            placeholder="Confirm new password"
            inputType="password"
          />

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl"
              disabled={!form.formState.isValid || isResetting}
              isLoading={isResetting}
            >
              {isResetting ? "Resetting..." : "Reset Password"}
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/login")}
              disabled={isResetting}
              className="text-gray-600"
            >
              Back to Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
