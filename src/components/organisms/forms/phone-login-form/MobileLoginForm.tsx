"use client"

import { Translate } from "gbusiness-ai-react-auto-translate"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/molecules/fields/InputField"
import { Heading, Paragraph } from "@/components/atoms/texts"
import { useMobileLoginForm } from "@/hooks/components/organisms/forms/use-mobile-login-form"
import { AnchorButton } from "@/components/atoms/controls/AnchorButton"
import { allowNumbersOnChange } from "@/lib/utils"
import { SelectComponent } from "@/components/atoms/controls/SelectComponent"
import { languageOptions } from "@/lib/languages"
import clsx from "clsx"
import { disableLoginWithMobile } from "@/lib/constants"

type MobileLoginFormProps = Partial<{ className: string }>

export function MobileLoginForm({ className }: MobileLoginFormProps) {
  const {
    mobileNumberForm,
    mobileNumberWithOTPForm,
    mobileLoginFormState,
    resendCooldown,
    sendingOtp,
    isLoading,
    onSubmit,
    handleResendOtp,
    handleBackToMobileInput,
  } = useMobileLoginForm()

  if (disableLoginWithMobile) {
    return (
      <>
        <Heading type="h4" className="font-semibold">
          Mobile login is currently disabled.
        </Heading>
        <div className="flex flex-col items-center justify-center">
          <AnchorButton
            href="/login?type=email"
            disabled={sendingOtp}
            label="Sign in with Email"
          />
          <Paragraph className="mt-7">
            Don&apos;t have an account?{" "}
            <AnchorButton
              href="/signup"
              disabled={sendingOtp}
              label="Sign up"
              className="text-sm text-primary font-semibold"
              oCNStyles
            />
          </Paragraph>
        </div>
      </>
    )
  }

  return !mobileLoginFormState.otpRequested ? (
    <Form {...mobileNumberForm}>
      <form
        onSubmit={mobileNumberForm.handleSubmit(onSubmit)}
        className={clsx("w-full lg:max-w-sm", className)}
      >
        <InputField
          fieldName="mobile"
          control={mobileNumberForm.control}
          label="Mobile Number"
          placeholder="Mobile Number"
          autoComplete="off"
          maxLength={10}
          onChange={(e) => allowNumbersOnChange(e, mobileNumberForm, "mobile")}
          readOnly={isLoading}
        />

        <SelectComponent
          id="language"
          label="Language"
          placeholder="Language"
          fieldName="language"
          control={mobileNumberForm.control}
          labelClassName="font-medium"
          options={languageOptions}
          isDisabled={isLoading}
        />

        <Button
          type="submit"
          className="mt-8 h-11 w-full rounded-xl"
          disabled={sendingOtp || !mobileNumberForm.formState.isValid}
          isLoading={sendingOtp}
        >
          <Translate>Send OTP</Translate>
        </Button>

        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-xs">Or</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <AnchorButton
            href="/login?type=email"
            disabled={sendingOtp}
            label="Sign in with Email"
          />
          <Paragraph className="mt-7">
            Don&apos;t have an account?{" "}
            <AnchorButton
              href="/signup"
              disabled={sendingOtp}
              label="Sign up"
              className="text-sm text-primary font-semibold"
              oCNStyles
            />
          </Paragraph>
        </div>
      </form>
    </Form>
  ) : (
    <Form {...mobileNumberWithOTPForm}>
      <form
        onSubmit={mobileNumberWithOTPForm.handleSubmit(onSubmit)}
        className="w-full lg:w-[360px]"
      >
        <InputField
          fieldName="mobile"
          control={mobileNumberWithOTPForm.control}
          label="Mobile Number"
          placeholder="Mobile Number"
          readOnly
        />
        <InputField
          control={mobileNumberWithOTPForm.control}
          fieldName="otp"
          label="OTP"
          placeholder="Enter 4-digit OTP"
          className="mb-[22px] mt-4"
          autoFocus
          readOnly={isLoading}
        />

        <Button
          type="submit"
          className="mt-6 h-10 w-full rounded-[10px]"
          isLoading={sendingOtp}
        >
          <Translate>Submit</Translate>
        </Button>

        <div className="text-sm text-center mt-3">
          <Button
            onClick={handleResendOtp}
            disabled={
              resendCooldown > 0 ||
              !mobileNumberWithOTPForm.formState.isValid ||
              isLoading
            }
            className="text-primary underline disabled:opacity-50"
          >
            {resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : "Resend OTP"}
          </Button>
        </div>

        <div className="text-sm text-center mt-2">
          <Button
            onClick={
              handleBackToMobileInput ||
              !mobileNumberWithOTPForm.formState.isValid
            }
            className="text-muted-foreground underline"
            disabled={isLoading}
          >
            Edit mobile number
          </Button>
        </div>
      </form>
    </Form>
  )
}
