import dynamic from "next/dynamic"

export const DynamicForecastForm = dynamic(
  () => import("./ForecastForm").then((mod) => mod.ForecastForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
