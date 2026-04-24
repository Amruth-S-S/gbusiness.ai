import dynamic from "next/dynamic"

export const DynamicPromptsRepositoryView = dynamic(
  () =>
    import("./PromptsRepositoryView").then((mod) => mod.PromptsRepositoryView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
