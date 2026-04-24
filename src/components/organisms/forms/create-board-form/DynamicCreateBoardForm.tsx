"use client"

import dynamic from "next/dynamic"

export const DynamicCreateBoardForm = dynamic(
  () => import("./CreateBoardForm").then((mod) => mod.CreateBoardForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
