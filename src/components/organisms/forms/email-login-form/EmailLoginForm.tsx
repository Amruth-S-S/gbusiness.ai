"use client"

/* eslint-disable react/no-array-index-key */
import { Translate } from "gbusiness-ai-react-auto-translate"
import { MdInfo } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/molecules/fields/InputField"
import { Heading, Paragraph } from "@/components/atoms/texts"
import { useEmailLoginForm } from "@/hooks/components/organisms/forms/use-email-login-form"
import { AnchorButton } from "@/components/atoms/controls/AnchorButton"
import { passwordRules } from "@/lib/utils"
import { SelectComponent } from "@/components/atoms/controls/SelectComponent"
import { languageOptions } from "@/lib/languages"
import clsx from "clsx"
import { DynamicOTPVerficationForm } from "../otp-verification-form/DynamicOTPVerificationForm"
import { disableLoginWithMobile } from "@/lib/constants"

type EmailLoginFormProps = Partial<{ className: string }>

export function EmailLoginForm({ className }: EmailLoginFormProps) {
  const {
    form,
    onSubmit,
    isLoading,
    otpSent,
    email,
    handleBackToEmail,
    handleOTPSuccess,
    isSendingOTP,
    password,
  } = useEmailLoginForm()

  if (otpSent) {
    return (
      <DynamicOTPVerficationForm
        identifier={email}
        identifierType="EMAIL"
        onSuccess={handleOTPSuccess}
        onBack={handleBackToEmail}
        className="w-full lg:max-w-sm"
        purpose="LOGIN"
        password={password}
      />
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit(onSubmit)()
        }}
        className={clsx("w-full lg:max-w-sm", className)}
      >
        <Heading
          type="h2"
          text="Welcome Back 👋"
          className="text-2xl font-semibold text-primary w-full mb-4"
        />

        <InputField
          fieldName="email"
          control={form.control}
          label="Email"
          placeholder="Enter your email"
          inputType="email"
          readOnly={isLoading || isSendingOTP}
        />

        <InputField
          fieldName="password"
          control={form.control}
          label="Password"
          placeholder="Enter your password"
          inputType="password"
          popoverTrigger={<MdInfo />}
          popoverContent={
            <ul className="text-sm space-y-1">
              {passwordRules.map((rule, index) => (
                <li key={index} className="text-gray-200">
                  • {rule.message}
                </li>
              ))}
            </ul>
          }
          className="my-2"
          readOnly={isLoading || isSendingOTP}
        />

        <SelectComponent
          id="language"
          label="Language"
          placeholder="Language"
          fieldName="language"
          control={form.control}
          labelClassName="font-medium"
          options={languageOptions}
          isDisabled={isLoading || isSendingOTP}
        />

        <Button
          type="submit"
          className="mt-6 h-11 w-full rounded-xl"
          isLoading={isLoading || isSendingOTP}
          disabled={!form.formState.isValid}
        >
          <Translate>Sign in</Translate>
        </Button>

        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-xs">Or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <div className="flex flex-col items-center justify-center">
          <AnchorButton
            href="/login?type=mobile"
            label="Sign in with Mobile"
            disabled={disableLoginWithMobile || isLoading}
          />

          <Paragraph className="mt-7 text-sm text-center">
            Don&apos;t have an account?{" "}
            <AnchorButton
              href="/signup"
              disabled={isLoading}
              label="Sign up"
              className="text-sm text-primary font-semibold"
              oCNStyles
            />
          </Paragraph>

          <AnchorButton
            href="/forgot-password"
            disabled={isLoading}
            label="Forgot Password?"
            className="text-sm text-primary mt-4 font-semibold"
            oCNStyles
          />
        </div>
      </form>
    </Form>
  )
}
