import dynamic from "next/dynamic"

export const DynamicChatView = dynamic(
  () => import("./ChatView").then((mod) => mod.ChatView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
