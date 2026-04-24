import dynamic from "next/dynamic"

export const DynamicSignUpForm = dynamic(
  () => import("./SignUpForm").then((mod) => mod.SignUpForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
