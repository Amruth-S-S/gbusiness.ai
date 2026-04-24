import dynamic from "next/dynamic"

export const DynamicPromptForm = dynamic(
  () => import("./PromptForm").then((mod) => mod.PromptForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
