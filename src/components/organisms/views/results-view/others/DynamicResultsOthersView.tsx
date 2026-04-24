import dynamic from "next/dynamic"

export const DynamicResultsOthersView = dynamic(
  () => import("./ResultsOthersView").then((mod) => mod.ResultsOthersView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
