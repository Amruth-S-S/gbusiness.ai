"use client"

import dynamic from "next/dynamic"

export const DynamicChangePasswordForm = dynamic(
  () => import("./ChangePasswordForm").then((mod) => mod.ChangePasswordForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
