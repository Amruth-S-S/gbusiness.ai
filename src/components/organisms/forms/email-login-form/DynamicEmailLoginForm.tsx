import dynamic from "next/dynamic"

export const DynamicEmailLoginForm = dynamic(
  () => import("./EmailLoginForm").then((mod) => mod.EmailLoginForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
