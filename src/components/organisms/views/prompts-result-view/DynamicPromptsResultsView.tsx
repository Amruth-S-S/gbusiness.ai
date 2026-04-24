import dynamic from "next/dynamic"

export const DynamicPromptsResultView = dynamic(
  () => import("./PromptsResultView").then((mod) => mod.PromptsResultView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
