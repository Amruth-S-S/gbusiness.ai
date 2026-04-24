import { Suspense } from "react"
import { AuthWrapper } from "@/components/organisms/wrappers/AuthWrapper"
import { DynamicForgotPasswordForm } from "@/components/organisms/forms/forgot-password-form/DynamicForgotPasswordForm"

export const metadata = {
  title: "Forgot Password | GBusiness AI",
  description: "Reset your password securely for your GBusiness AI account.",
}

export default function ForgotPasswordPage() {
  return (
    <main className="w-full">
      <Suspense>
        <AuthWrapper>
          <DynamicForgotPasswordForm />
        </AuthWrapper>
      </Suspense>
    </main>
  )
}
