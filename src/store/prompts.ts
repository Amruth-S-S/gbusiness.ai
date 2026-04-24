import { create } from "zustand"
import { persist } from "zustand/middleware"
import { get } from "@/services/utils"
import { Prompt } from "@/services"
import { ExecutedPrompts } from "@/lib/types"

export type SelectedPromptInfo = {
  type?: "add" | "edit" | "delete" | null
  promptText?: string
  promptId?: number
}

interface PromptsState {
  isLoading: boolean
  data: Prompt[]
  error: string | null
  selectedPromptInfo: SelectedPromptInfo | null
  executedPrompt: ExecutedPrompts
  promptNumber: number | null

  fetchPrompts: (apiKey: string, boardId: number) => void
  updatePromptsState: (partialState: Partial<PromptsState>) => void
  resetPromptState: () => void
}

const initialExecutedPrompt: ExecutedPrompts = {
  message: [],
  table: null,
  statusCode: 0,
  detail: "",
  startTime: "",
  endTime: "",
  durationSeconds: 0,
  charts: [],
}

export const usePromptsStore = create<PromptsState>()(
  persist(
    (set) => ({
      isLoading: true,
      data: [],
      error: null,
      selectedPromptInfo: null,
      executedPrompt: initialExecutedPrompt,
      promptNumber: null,

      fetchPrompts: (apiKey: string, boardId: number) => {
        set(() => ({
          isLoading: true,
          data: [],
          error: null,
          selectedPromptInfo: null,
        }))
        get(`/main-boards/boards/${apiKey}/${boardId}`)
          .then((res) => {
            set(() => ({
              data: res.data,
              isLoading: false,
              error: null,
            }))
          })
          .catch(() => {
            set(() => ({
              data: [],
              isLoading: false,
              error: "Please review and modify the prompt with more specifics.",
            }))
          })
      },

      updatePromptsState: (partial) => set(() => ({ ...partial })),

      resetPromptState: () =>
        set(() => ({
          isLoading: true,
          data: [],
          error: null,
          selectedPromptInfo: null,
          executedPrompt: initialExecutedPrompt,
        })),
    }),
    {
      name: "prompts-storage",
      partialize: (state) => ({
        executedPrompt: state.executedPrompt,
      }),
    },
  ),
)
