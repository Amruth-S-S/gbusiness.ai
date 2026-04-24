"use client"

import { DynamicOTPVerficationForm } from "@/components/organisms/forms/otp-verification-form/DynamicOTPVerificationForm"
import { AuthWrapper } from "@/components/organisms/wrappers/AuthWrapper"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { toast } from "react-hot-toast"

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const email = searchParams.email
  const router = useRouter()

  if (!email) {
    toast.error("Invalid verification link")
    router.push("/signup")
    return null
  }

  const handleSuccess = () => {
    toast.success("Email verified successfully!")
    router.push("/login?verified=true")
  }

  const handleBack = () => {
    router.push("/signup")
  }

  return (
    <main className="w-full">
      <Suspense>
        <AuthWrapper>
          <DynamicOTPVerficationForm
            identifier={email}
            identifierType="EMAIL"
            purpose="VERIFY_EMAIL"
            onSuccess={handleSuccess}
            onBack={handleBack}
            className="w-full lg:max-w-sm"
          />
        </AuthWrapper>
      </Suspense>
    </main>
  )
}
