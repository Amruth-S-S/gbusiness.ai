import dynamic from "next/dynamic"

export const DynamicRagPromptForm = dynamic(
  () => import("./RagPromptForm").then((mod) => mod.RagPromptForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
