import dynamic from "next/dynamic"

export const DynamicUploadDocumentsView = dynamic(
  () => import("./UploadDocumentsView").then((mod) => mod.UploadDocumentsView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
