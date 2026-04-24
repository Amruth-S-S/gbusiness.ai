"use client"

import { DynamicResetPasswordForm } from "@/components/organisms/forms/reset-password-form/DynamicResetPasswordForm"
import { AuthWrapper } from "@/components/organisms/wrappers/AuthWrapper"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { toast } from "react-hot-toast"

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const router = useRouter()

  const otpCode = searchParams.otpCode
  const identifier = searchParams.identifier
  const identifierType = searchParams.identifier_type as "EMAIL" | "PHONE"

  if (!identifier || !identifierType) {
    toast.error("Invalid reset link")
    router.push("/forgot-password")
    return null
  }

  return (
    <main className="w-full">
      <Suspense>
        <AuthWrapper>
          <DynamicResetPasswordForm
            identifier={identifier}
            identifierType={identifierType}
            otpCode={otpCode}
          />
        </AuthWrapper>
      </Suspense>
    </main>
  )
}
