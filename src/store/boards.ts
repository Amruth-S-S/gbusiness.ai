// src/store/boards.ts

import { create } from "zustand"
import {
  MainBoard,
  Prompt,
  ExecutedPrompts,
  TreeInfo,
  MainBoardType,
} from "@/lib/types"
import { fetchWrapper } from "@/lib/fetch-wrapper"
import { convertBodyToCamelCaseFromSnake } from "@/lib/utils"
import { baseUrl } from "@/lib/constants"
import { MainBoard as SelectedMainBoard, Board } from "@/lib/main-boards"

interface SelectedTreeItem {
  id: string
  name: string
  type?: MainBoardType | null
}

interface BoardsState {
  mainBoards: MainBoard[]
  prompts: Prompt[]
  executedPrompts: ExecutedPrompts
  isLoading: boolean
  treeNodes: TreeInfo[]
  selectedTreeItem: SelectedTreeItem | null
  selectedPrompt: { id: number; name: string } | null
  fetchedAt: Date | null
  boardId: number | null
  error: any
  selectedMainBoard: SelectedMainBoard | null
  selectedBoard: Board | null
}

interface BoardsStore extends BoardsState {
  updateBoardsState: (data: Partial<BoardsState>) => void
  fetchTreeInfo: () => Promise<void>
}

const initialExecutedPrompts: ExecutedPrompts = {
  message: [],
  table: { columns: [], data: [], title: "" },
  statusCode: 0,
  detail: "",
  startTime: "",
  endTime: "",
  durationSeconds: 0,
  charts: [],
}

export const useBoardsStore = create<BoardsStore>((set) => ({
  mainBoards: [],
  prompts: [],
  executedPrompts: initialExecutedPrompts,
  isLoading: true,
  treeNodes: [],
  selectedTreeItem: null,
  selectedPrompt: null,
  fetchedAt: null,
  boardId: null,
  error: null,
  selectedBoard: null,
  selectedMainBoard: null,

  updateBoardsState: (data) => set((state) => ({ ...state, ...data })),

  fetchTreeInfo: async () => {
    const url = new URL("main-boards/get_all_info_tree", baseUrl)
    set({ isLoading: true })
    const { data: res, error } = await fetchWrapper<TreeInfo[]>(url.href, {
      method: "GET",
    })
    if (res) {
      const response = convertBodyToCamelCaseFromSnake<TreeInfo[]>(res)
      set({
        treeNodes: response,
        isLoading: false,
        error: null,
        selectedTreeItem: null,
        selectedPrompt: null,
        fetchedAt: new Date(),
      })
    } else {
      set({
        treeNodes: [],
        isLoading: false,
        error,
        selectedTreeItem: null,
        selectedPrompt: null,
      })
    }
  },
}))
