import dynamic from "next/dynamic"

export const DynamicAnalysisDMT = dynamic(
  () => import("./AnalysisDMT").then((md) => md.AnalysisDMT),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
