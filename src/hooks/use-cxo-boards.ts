import { Dispatch, useEffect, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import type {
  ExecutedPrompts,
  MainBoardType,
  Prompt,
  TreeInfo,
} from "@/lib/types"
import { get } from "@/services/utils"
import { BreadcrumbItemProps } from "@/components/atoms/controls/BreadCrumbComponent"
import { labels } from "@/components/organisms/lists/cxo-boards-list/CXOBoardsList"
import { useCollectionsStore } from "@/store/collections"
import { convertBodyToCamelCase } from "@/lib/utils"
import { useCXOBoardsStore } from "@/store/cxo-boards"

type SelectedCXOBoardInfo = {
  boardName?: string
  boardId?: number
}
interface CXOBoardsState {
  isLoading: boolean
  data: TreeInfo[]
  error: string | null
  selectedCXOBoardInfo: SelectedCXOBoardInfo | null
  executedPrompt: ExecutedPrompts
  breadCrumbItems: BreadcrumbItemProps[]
  prompts: Prompt[]
  selectedPrompt: string | null
  boardType: MainBoardType | null
}

type DispatchCXOBoardsState = Dispatch<
  CXOBoardsState | ((prevState: CXOBoardsState) => CXOBoardsState)
>

export type RUseCXOBoards = {
  cxoBoardsState: CXOBoardsState
  setCXOBoardsState: DispatchCXOBoardsState
}

type UseCXOBoards = () => RUseCXOBoards

export const fetchCXOBoardsData = async (
  setBoardState: DispatchCXOBoardsState,
) => {
  get("main-boards/get_all_info_tree")
    .then((res) => {
      const response = res.data.map((data: TreeInfo) =>
        convertBodyToCamelCase(data),
      )
      setBoardState((prev) => ({
        ...prev,
        data: response,
        isLoading: false,
        error: null,
        selectedBoardInfo: null,
      }))
    })
    .catch(() => {
      setBoardState((prev) => ({
        ...prev,
        data: [],
        isLoading: false,
        error: "Something went wrong",
        selectedBoardInfo: null,
      }))
    })
}

export const useCXOBoards: UseCXOBoards = () => {
  const pathName = usePathname()
  const { mainBoardId, boardId } = useParams()
  const { data: collectionsData } = useCollectionsStore()
  const { updateCXOBoardsStore } = useCXOBoardsStore()
  const [cxoBoardsState, setCXOBoardsState] = useState<CXOBoardsState>({
    isLoading: true,
    data: [],
    error: null,
    selectedCXOBoardInfo: null,
    executedPrompt: {
      message: [],
      table: null,
      statusCode: 0,
      detail: "",
      startTime: "",
      endTime: "",
      durationSeconds: 0,
      charts: [],
    },
    breadCrumbItems: [],
    prompts: [],
    selectedPrompt: null,
    boardType: null,
  })

  useEffect(() => {
    fetchCXOBoardsData(setCXOBoardsState)
  }, [])

  useEffect(() => {
    if (mainBoardId && cxoBoardsState.data.length) {
      const tempBreadCrumbItems: BreadcrumbItemProps[] = [
        { label: "Home", href: "/cxo" },
      ]
      const selectedMainBoard = cxoBoardsState.data.find(
        (data) => data.mainBoardId === Number(mainBoardId),
      )
      if (selectedMainBoard?.name) {
        tempBreadCrumbItems.push({
          label:
            labels[selectedMainBoard.mainBoardType] ?? selectedMainBoard.name,
          ...(boardId && { href: `/cxo/main-boards/${mainBoardId}` }),
        })
      }
      if (boardId && selectedMainBoard?.boards) {
        if (cxoBoardsState.boardType === "RAG") {
          collectionsData.forEach((collection) => {
            if (collection.id === Number(boardId)) {
              tempBreadCrumbItems.push({
                label: collection.name,
              })
            }
          })
        } else {
          Object.entries(selectedMainBoard.boards).forEach(([id, board]) => {
            if (id === boardId) {
              tempBreadCrumbItems.push({
                label: board.name,
              })
            }
          })
        }
        if (cxoBoardsState.boardType !== "USE_CASES") {
          get(
            cxoBoardsState.boardType === "FORECAST"
              ? `/main-boards/boards/forecast-chat-response/board/${boardId}`
              : `/main-boards/boards/prompts/${mainBoardId}/${boardId}/prompts`,
          )
            .then((res) => {
              const response = res.data
              setCXOBoardsState((prevState) => ({
                ...prevState,
                prompts: response,
              }))
            })
            .catch(() =>
              setCXOBoardsState((prevState) => ({ ...prevState, prompts: [] })),
            )
        }
      }
      updateCXOBoardsStore({ breadCrumbItems: tempBreadCrumbItems })
    } else {
      updateCXOBoardsStore({ breadCrumbItems: [] })
    }
  }, [
    pathName,
    mainBoardId,
    boardId,
    cxoBoardsState.data,
    cxoBoardsState.boardType,
  ])

  return { cxoBoardsState, setCXOBoardsState }
}
