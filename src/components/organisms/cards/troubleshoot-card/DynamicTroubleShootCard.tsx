import dynamic from "next/dynamic"

export const DynamicTroubleShootCard = dynamic(
  () => import("./TroubleShootCard").then((mod) => mod.TroubleShootCard),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
