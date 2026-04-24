import dynamic from "next/dynamic"

export const DynamicMiddlePane = dynamic(
  () => import("./MiddlePane").then((mod) => mod.MiddlePane),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
