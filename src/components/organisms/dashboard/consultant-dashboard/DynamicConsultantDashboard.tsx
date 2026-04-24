import dynamic from "next/dynamic"

export const DynamicConsultantDashboard = dynamic(
  () => import("./ConsultantDashboard").then((mod) => mod.ConsultantDashboard),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
