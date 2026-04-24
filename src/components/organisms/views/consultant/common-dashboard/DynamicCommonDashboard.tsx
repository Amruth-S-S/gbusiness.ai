import dynamic from "next/dynamic"
import { SettingsViewProps } from "@/lib/props"
import { ExecutedPrompts } from "@/lib/types"

export type CommonDashboardProps = {
  info: SettingsViewProps["info"] & {
    executedPrompt: ExecutedPrompts
    boardId?: number | null
  }
}

export const DynamicCommonDashboard = dynamic<CommonDashboardProps>(
  () => import("./CommonDashboard").then((mod) => mod.CommonDashboard),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
