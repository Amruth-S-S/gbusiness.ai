import { Dispatch, useEffect, useState } from "react"
import type {
  ExecutedPrompts,
  MainBoard,
  MainBoardType,
  Prompt,
  TreeInfo,
} from "@/lib/types"
import { baseUrl } from "@/lib/constants"
import { fetchWrapper } from "@/lib/fetch-wrapper"
import { convertBodyToCamelCaseFromSnake } from "@/lib/utils"

interface BoardsState {
  mainBoards: MainBoard[]
  prompts: Prompt[]
  executedPrompts: ExecutedPrompts
  isLoading: boolean
  treeNodes: TreeInfo[]
  selectedTreeItem: {
    id: string
    name: string
    type?: MainBoardType | null
  } | null
  selectedPrompt: { id: number; name: string } | null
  fetchedAt: Date
  boardId: number | null
}

export type DispatchBoardsState = Dispatch<
  BoardsState | ((prevState: BoardsState) => BoardsState)
>

export type RUseBoards = {
  boardState: BoardsState
  setBoardState: DispatchBoardsState
}

type UseBoards = () => RUseBoards

export const fetchTreeInfo = async (setBoardState: DispatchBoardsState) => {
  const url = new URL("main-boards/get_all_info_tree", baseUrl)
  const { data: res, error } = await fetchWrapper<TreeInfo[]>(url.href, {
    method: "GET",
  })
  if (res) {
    const response = convertBodyToCamelCaseFromSnake<TreeInfo[]>(res)
    setBoardState((prev) => ({
      ...prev,
      treeNodes: response,
      isLoading: false,
      error: null,
      selectedTreeItem: null,
      selectedPrompt: null,
      fetchedAt: new Date(),
    }))
  }
  if (error) {
    setBoardState((prev) => ({
      ...prev,
      data: [],
      isLoading: false,
      error,
      selectedTreeItem: null,
      selectedPrompt: null,
    }))
  }
}

export const useBoards: UseBoards = () => {
  const [boardState, setBoardState] = useState<BoardsState>({
    mainBoards: [],
    prompts: [],
    executedPrompts: {
      message: [],
      table: { columns: [], data: [], title: "" },
      statusCode: 0,
      detail: "",
      startTime: "",
      endTime: "",
      durationSeconds: 0,
      charts: [],
    },
    isLoading: true,
    treeNodes: [],
    selectedTreeItem: null,
    selectedPrompt: null,
    fetchedAt: new Date(),
    boardId: null,
  })

  useEffect(() => {
    fetchTreeInfo(setBoardState)
  }, [])

  return { boardState, setBoardState }
}
