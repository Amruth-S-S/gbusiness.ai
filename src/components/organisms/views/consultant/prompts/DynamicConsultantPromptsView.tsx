import dynamic from "next/dynamic"

export const DynamicConsultantPromptsView = dynamic(
  () =>
    import("./ConsultantPromptsView").then((mod) => mod.ConsultantPromptsView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
