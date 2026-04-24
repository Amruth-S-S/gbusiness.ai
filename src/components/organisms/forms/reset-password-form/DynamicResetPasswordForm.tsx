import dynamic from "next/dynamic"

export interface ResetPasswordFormProps {
  identifier: string
  identifierType: "EMAIL" | "PHONE"
  otpCode?: string
  onSuccess?: () => void
}

export const DynamicResetPasswordForm = dynamic<ResetPasswordFormProps>(
  () => import("./ResetPasswordForm").then((mod) => mod.ResetPasswordForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
