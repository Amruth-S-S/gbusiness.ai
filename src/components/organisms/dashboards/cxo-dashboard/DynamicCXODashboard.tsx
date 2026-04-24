"use client"

import dynamic from "next/dynamic"

export const DynamicCXODashboard = dynamic(
  () => import("./CXODashboard").then((mod) => mod.CXODashboard),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
