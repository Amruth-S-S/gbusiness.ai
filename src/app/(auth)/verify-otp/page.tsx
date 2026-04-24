"use client"

import { useRouter } from "next/navigation"
import { AuthWrapper } from "@/components/organisms/wrappers/AuthWrapper"
import { DynamicOTPVerficationForm } from "@/components/organisms/forms/otp-verification-form/DynamicOTPVerificationForm"
import { useEffect } from "react"

export default function VerifyOTPPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const router = useRouter()
  const identifier = searchParams.identifier
  const identifierType = searchParams.identifier_type as "EMAIL" | "PHONE"
  const purpose = searchParams.purpose as
    | "RESET_PASSWORD"
    | "CHANGE_PASSWORD"
    | "VERIFY_EMAIL"
    | "LOGIN"

  useEffect(() => {
    if (!identifier || !identifierType || !purpose) {
      router.push("/login")
    }
  }, [identifier, identifierType, purpose, router])

  if (!identifier || !identifierType || !purpose) {
    return null
  }

  const handleSuccess = (data: { otpCode: string }) => {
    switch (purpose) {
      case "RESET_PASSWORD":
        router.push(
          `/reset-password?identifier=${encodeURIComponent(
            identifier,
          )}&identifier_type=${identifierType}&otpCode=${data.otpCode}`,
        )
        break
      case "CHANGE_PASSWORD":
        router.push(
          `/change-password?identifier=${encodeURIComponent(
            identifier,
          )}&identifier_type=${identifierType}`,
        )
        break
      case "VERIFY_EMAIL":
        router.push("/login?verified=true")
        break
      case "LOGIN":
        router.push("/")
        break
      default:
        router.push("/login")
    }
  }

  const handleBack = () => {
    switch (purpose) {
      case "RESET_PASSWORD":
        router.push("/forgot-password")
        break
      case "CHANGE_PASSWORD":
        router.push("/profile")
        break
      case "VERIFY_EMAIL":
        router.push("/signup")
        break
      default:
        router.push("/login")
    }
  }

  return (
    <main className="w-full">
      <AuthWrapper>
        <DynamicOTPVerficationForm
          identifier={identifier}
          identifierType={identifierType}
          purpose={purpose}
          onSuccess={handleSuccess}
          onBack={handleBack}
          className="w-full lg:max-w-sm"
        />
      </AuthWrapper>
    </main>
  )
}
