import dynamic from "next/dynamic"

export const DynamicCXOMainBoards = dynamic(
  () => import("./CXOMainBoards").then((md) => md.CXOMainBoards),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
