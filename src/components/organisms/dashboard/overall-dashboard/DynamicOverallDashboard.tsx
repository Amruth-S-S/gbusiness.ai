import dynamic from "next/dynamic"

export const DynamicOverallDashboard = dynamic(
  () => import("./OverallDashboard").then((mod) => mod.OverallDashboard),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
