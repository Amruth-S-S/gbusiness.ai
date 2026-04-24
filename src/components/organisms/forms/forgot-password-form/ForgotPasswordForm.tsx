// ForgotPasswordForm.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Form, FormLabel } from "@/components/ui/form"
import { Paragraph } from "@/components/atoms/texts"
import { AnchorButton } from "@/components/atoms/controls/AnchorButton"
import { useForgotPasswordForm } from "@/hooks/components/organisms/forms/use-forgot-password-form"
import { InputField } from "@/components/molecules/fields/InputField"
import { type SendOTPRequest } from "@/services"

export interface ForgotPasswordFormProps {
  redirectToOtp?: boolean
  onOTPSent?: (payload: SendOTPRequest) => void
}

export function ForgotPasswordForm(props: ForgotPasswordFormProps) {
  const { form, isSending, onSubmit, handleIdentifierTypeChange } =
    useForgotPasswordForm(props)

  return (
    <div className="w-full lg:max-w-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Forgot Password?
        </h2>
        <Paragraph className="text-gray-600">
          Enter your email or phone number to receive a reset code
        </Paragraph>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormLabel>Reset via</FormLabel>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={
                  form.watch("identifier_type") === "EMAIL"
                    ? "default"
                    : "outline"
                }
                onClick={() => handleIdentifierTypeChange("EMAIL")}
                className="flex-1"
              >
                Email
              </Button>
              <Button
                type="button"
                variant={
                  form.watch("identifier_type") === "PHONE"
                    ? "default"
                    : "outline"
                }
                onClick={() => handleIdentifierTypeChange("PHONE")}
                className="flex-1"
                disabled
              >
                Phone
              </Button>
            </div>
          </div>

          <InputField
            fieldName="identifier"
            control={form.control}
            label={
              form.watch("identifier_type") === "EMAIL"
                ? "Email Address"
                : "Phone Number"
            }
            placeholder={
              form.watch("identifier_type") === "EMAIL"
                ? "Enter your email address"
                : "Enter your phone number"
            }
            inputType={
              form.watch("identifier_type") === "EMAIL" ? "email" : "tel"
            }
            readOnly={isSending}
          />

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full h-11 rounded-xl"
              disabled={!form.formState.isValid || isSending}
              isLoading={isSending}
            >
              {isSending ? "Sending..." : "Send Reset Code"}
            </Button>
          </div>

          <div className="text-center">
            <Paragraph className="text-sm">
              Remember your password?{" "}
              <AnchorButton
                href="/login"
                disabled={isSending}
                label="Sign in"
                className="text-sm mt-2 text-primary font-semibold"
              />
            </Paragraph>
          </div>
        </form>
      </Form>
    </div>
  )
}
