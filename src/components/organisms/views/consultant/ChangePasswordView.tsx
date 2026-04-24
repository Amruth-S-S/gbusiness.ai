import { useState } from "react"
import { DynamicChangePasswordForm } from "../../forms/change-password-form/DynamicChangePasswordForm"
import { DynamicOTPVerficationForm } from "../../forms/otp-verification-form/DynamicOTPVerificationForm"

type View = "otp" | "changePassword"

interface ChangePasswordViewProps {
  email: string
  onBack: () => void
}

export function ChangePasswordView({ email, onBack }: ChangePasswordViewProps) {
  const [currentView, setCurrentView] = useState<View>("otp")
  const [otpCode, setOtpCode] = useState("")

  const handleOTPSuccess = (data: { otpCode: string }) => {
    setOtpCode(data.otpCode)
    setCurrentView("changePassword")
  }

  if (currentView === "otp") {
    return (
      <DynamicOTPVerficationForm
        identifier={email}
        identifierType="EMAIL"
        onSuccess={handleOTPSuccess}
        onBack={onBack}
        className="w-full lg:max-w-sm p-5"
        purpose="CHANGE_PASSWORD"
      />
    )
  }

  return (
    <DynamicChangePasswordForm
      className="p-5"
      identifier={email}
      identifierType="EMAIL"
      otpCode={otpCode}
      onBackBtnClick={onBack}
    />
  )
}
