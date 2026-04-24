import dynamic from "next/dynamic"

export const DynamicConsultantDashboardLayout = dynamic(
  () =>
    import("./ConsultantDashboardLayout").then(
      (mod) => mod.ConsultantDashboardLayout,
    ),
  {
    loading: () => <div>Loading</div>,
  },
)
