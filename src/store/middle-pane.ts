import { create } from "zustand"
import type { SettingsData, AnalysisDMT, TabKey, Prompt } from "@/lib/types"
import { baseUrl } from "@/lib/constants"
import { fetchWrapper } from "@/lib/fetch-wrapper"
import {
  convertBodyToCamelCaseFromSnake,
  iterateErrorResponse,
} from "@/lib/utils"

type TabState<T> = {
  isLoading: boolean
  error: string | null
  data: T[]
}

interface MiddlePaneState {
  dataManagementTables: TabState<AnalysisDMT>
  managePrompts: TabState<Prompt>
  promptsRepository: TabState<Prompt>
  aiDocumentation: TabState<SettingsData>
  masterSettings: TabState<SettingsData>
  timelineSettings: TabState<SettingsData>
  kpiDefinition: TabState<SettingsData>
  otherParameterDefinitions: TabState<SettingsData>
  prompts: TabState<SettingsData>
}

type TabKeyToType = {
  dataManagementTables: AnalysisDMT
  managePrompts: Prompt
  promptsRepository: Prompt
  aiDocumentation: SettingsData
  masterSettings: SettingsData
  timelineSettings: SettingsData
  kpiDefinition: SettingsData
  otherParameterDefinitions: SettingsData
  prompts: SettingsData
}

interface MiddlePaneStore {
  middlePaneState: MiddlePaneState
  fetchData: (key: TabKey, apiKey: string) => Promise<void>
}

const createEmptyTabState = <T>(): TabState<T> => ({
  isLoading: true,
  error: null,
  data: [],
})

export const useMiddlePaneStore = create<MiddlePaneStore>((set) => ({
  middlePaneState: {
    dataManagementTables: createEmptyTabState<AnalysisDMT>(),
    managePrompts: createEmptyTabState<Prompt>(),
    promptsRepository: createEmptyTabState<Prompt>(),
    aiDocumentation: createEmptyTabState<SettingsData>(),
    masterSettings: createEmptyTabState<SettingsData>(),
    timelineSettings: createEmptyTabState<SettingsData>(),
    kpiDefinition: createEmptyTabState<SettingsData>(),
    otherParameterDefinitions: createEmptyTabState<SettingsData>(),
    prompts: createEmptyTabState<SettingsData>(),
  },

  fetchData: async (key, apiKey) => {
    const loader = document.getElementById("circles-with-bar-loader")
    if (loader) loader.style.display = "flex"

    set((state) => ({
      middlePaneState: {
        ...state.middlePaneState,
        [key]: {
          data: [],
          isLoading: true,
          error: null,
        },
      },
    }))

    try {
      const url = new URL(
        key === "dataManagementTables"
          ? "/main-boards/boards/data-management-table/get_all_tables_with_files"
          : `/main-boards/boards/${apiKey}/`,
        baseUrl,
      )

      type ItemType = TabKeyToType[typeof key]
      const { data: rawRes, error } = await fetchWrapper<ItemType[]>(url.href, {
        method: "GET",
      })

      if (rawRes) {
        const response = rawRes.map((item) =>
          convertBodyToCamelCaseFromSnake(item),
        ) as ItemType[]

        set((state) => ({
          middlePaneState: {
            ...state.middlePaneState,
            [key]: {
              data: response,
              isLoading: false,
              error: null,
            },
          },
        }))
      } else if (error && typeof error === "object") {
        iterateErrorResponse(error)
        set((state) => ({
          middlePaneState: {
            ...state.middlePaneState,
            [key]: {
              data: [],
              isLoading: false,
              error,
            },
          },
        }))
      }
    } catch (err) {
      if (err && typeof err === "object") {
        iterateErrorResponse(err)
        set((state) => ({
          middlePaneState: {
            ...state.middlePaneState,
            [key]: {
              data: [],
              isLoading: false,
              error: err,
            },
          },
        }))
      }
    } finally {
      if (loader) loader.style.display = "none"
    }
  },
}))
