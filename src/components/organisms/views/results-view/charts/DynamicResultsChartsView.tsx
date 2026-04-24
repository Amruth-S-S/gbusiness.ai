import dynamic from "next/dynamic"

export const DynamicResultsChartsView = dynamic(
  () => import("./ResultsChartsView").then((mod) => mod.ResultsChartsView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
