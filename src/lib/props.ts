import { TabKey } from "./types"

export type SettingsViewProps = {
  info: {
    name: TabKey
    apiKey: string
    secondaryApiKey?: string
  }
}
