import dynamic from "next/dynamic"

export const DynamicResultsTableView = dynamic(
  () => import("./ResultsTableView").then((mod) => mod.ResultsTableView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
