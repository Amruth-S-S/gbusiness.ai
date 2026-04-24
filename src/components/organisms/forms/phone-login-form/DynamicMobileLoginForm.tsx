import dynamic from "next/dynamic"

export const DynamicMobileLoginForm = dynamic(
  () => import("./MobileLoginForm").then((mod) => mod.MobileLoginForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
