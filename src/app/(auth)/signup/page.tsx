import { Suspense } from "react"
import { AuthWrapper } from "@/components/organisms/wrappers/AuthWrapper"
import { DynamicSignUpForm } from "@/components/organisms/forms/sign-up-form/DynamicSignUpForm"

export const metadata = {
  title: "Sign Up | GBusiness AI",
  description: "Create a new account securely for GBusiness AI.",
}

export default function SignUp() {
  return (
    <main className="w-full">
      <Suspense>
        <AuthWrapper>
          <DynamicSignUpForm />
        </AuthWrapper>
      </Suspense>
    </main>
  )
}
