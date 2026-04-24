import dynamic from "next/dynamic"

export const DynamicForgotPasswordForm = dynamic(
  () => import("./ForgotPasswordForm").then((mod) => mod.ForgotPasswordForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
