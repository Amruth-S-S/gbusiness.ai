import dynamic from "next/dynamic"

export const DynamicAnalysisFileUpload = dynamic(
  () =>
    import("./AnalysisDMTFileUpload").then((mod) => mod.AnalysisDMTFileUpload),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
