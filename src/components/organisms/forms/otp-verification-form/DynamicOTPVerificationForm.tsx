import dynamic from "next/dynamic"

export const DynamicOTPVerficationForm = dynamic(
  () => import("./OTPVerificationForm").then((mod) => mod.OTPVerificationForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
