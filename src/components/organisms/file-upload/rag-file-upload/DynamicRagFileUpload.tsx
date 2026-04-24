import dynamic from "next/dynamic"

export const DynamicRagFileUpload = dynamic(
  () => import("./RagFileUpload").then((mod) => mod.RagFileUpload),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
