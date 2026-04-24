import dynamic from "next/dynamic"

export const DynamicCXOBoard = dynamic(
  () => import("./CXOBoard").then((md) => md.CXOBoard),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
