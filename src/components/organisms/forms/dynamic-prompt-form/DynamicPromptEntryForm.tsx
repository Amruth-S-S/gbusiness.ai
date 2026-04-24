import dynamic from "next/dynamic"

export const DynamicPromptEntryForm = dynamic(
  () => import("./PromptEntryForm").then((mod) => mod.PromptEntryForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
