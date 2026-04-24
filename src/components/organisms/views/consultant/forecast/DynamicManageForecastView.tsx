import dynamic from "next/dynamic"

export const DynamicManageForecastView = dynamic(
  () => import("./ManageForecastView").then((mod) => mod.ManageForecastView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
