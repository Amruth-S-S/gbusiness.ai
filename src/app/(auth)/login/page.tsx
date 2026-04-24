import { DynamicEmailLoginForm } from "@/components/organisms/forms/email-login-form/DynamicEmailLoginForm"
import { DynamicMobileLoginForm } from "@/components/organisms/forms/phone-login-form/DynamicMobileLoginForm"
import { AuthWrapper } from "@/components/organisms/wrappers/AuthWrapper"
import { Suspense } from "react"

export const metadata = {
  title: "Login | GBusiness AI",
  description: "Login securely to your GBusiness AI account.",
}

export default function Login({
  searchParams,
}: {
  searchParams: { type?: string }
}) {
  const queryParam = searchParams.type

  return (
    <main className="w-full">
      <Suspense>
        <AuthWrapper>
          {queryParam === "email" && <DynamicEmailLoginForm />}
          {queryParam === "mobile" && <DynamicMobileLoginForm />}
        </AuthWrapper>
      </Suspense>
    </main>
  )
}
