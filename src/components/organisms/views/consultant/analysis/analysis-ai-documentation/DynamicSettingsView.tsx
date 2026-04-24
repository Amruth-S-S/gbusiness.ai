import dynamic from "next/dynamic"

export const DynamicSettingsView = dynamic(
  () => import("./SettingsView").then((md) => md.SettingsView),
  {
    ssr: true,
    loading: () => <div>Loading</div>,
  },
)
