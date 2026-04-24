import dynamic from "next/dynamic"
import { SettingsViewProps } from "@/lib/props"

export const DynamicSimpleSettingsForm = dynamic<SettingsViewProps>(
  () => import("./SimpleSettingsForm").then((mod) => mod.SimpleSettingsForm),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
