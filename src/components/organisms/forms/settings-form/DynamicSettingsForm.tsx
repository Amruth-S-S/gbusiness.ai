import dynamic from "next/dynamic"
import { SettingsViewProps } from "@/lib/props"

export const DynamicSettingsForm = dynamic<SettingsViewProps>(
  () => import("./SettingsForm").then((mod) => mod.SettingsForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
