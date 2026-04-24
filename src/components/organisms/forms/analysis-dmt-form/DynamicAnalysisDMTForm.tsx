import dynamic from "next/dynamic"

export const DynamicAnalysisDMTForm = dynamic(
  () => import("./AnalysisDMTForm").then((mod) => mod.AnalysisDMTForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
