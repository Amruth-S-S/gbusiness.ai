import dynamic from "next/dynamic"

export const DynamicCXOBoardsList = dynamic(
  () => import("./CXOBoardsList").then((mod) => mod.CXOBoardsList),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
