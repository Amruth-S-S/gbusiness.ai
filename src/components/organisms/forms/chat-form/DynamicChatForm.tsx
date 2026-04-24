"use client"

import dynamic from "next/dynamic"

export const DynamicChatForm = dynamic(
  () => import("./ChatForm").then((mod) => mod.ChatForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
