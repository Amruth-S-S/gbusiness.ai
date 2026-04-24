import {
  BarChart2,
  Bot,
  Database,
  FileText,
  FlaskConical,
  LayoutDashboard,
  LineChart,
  type LucideIcon,
} from "lucide-react"
import { CollectionsStore } from "@/store/collections"
import { Collection, MainBoardType, TreeInfo } from "./types"

export interface Board {
  id: number
  key: string
  title: string
  url: string
  isActive: boolean
}

export interface MainBoard {
  id: number
  key: string
  title: string
  url: string
  icon: LucideIcon
  isActive: boolean
  type: MainBoardType
  boards: Board[]
}

export const getBoardIcon = (mainBoard: TreeInfo): LucideIcon => {
  const name = mainBoard.name.toLowerCase()
  const type = mainBoard.mainBoardType

  if (type === MainBoardType.RAG) return Bot
  if (type === MainBoardType.ANALYSIS) {
    if (name.includes("forecast")) return LineChart
    if (name.includes("test")) return FlaskConical
    return BarChart2
  }
  if (name.includes("document")) return FileText
  if (name.includes("data")) return Database
  if (name.includes("test")) return FlaskConical
  return LayoutDashboard
}

export const getMainBoards = (
  treeNodes: TreeInfo[],
  collectionsStore: CollectionsStore,
): MainBoard[] => {
  const sortOrder: Record<string, number> = {
    ANALYSIS: 0,
    RAG: 1,
    FORECAST: 2,
  }

  return treeNodes
    .slice()
    .sort((a, b) => sortOrder[a.mainBoardType] - sortOrder[b.mainBoardType])
    .map((mainBoard) => ({
      id: mainBoard.mainBoardId,
      key: `${mainBoard.name}-${mainBoard.mainBoardId}`,
      title: mainBoard.name,
      url: "#",
      icon: getBoardIcon(mainBoard),
      isActive: mainBoard.isSelected,
      type: mainBoard.mainBoardType,
      boards: Object.entries(
        mainBoard.mainBoardType === MainBoardType.RAG
          ? collectionsStore.data
          : mainBoard.boards,
      )
        .filter(
          ([_, board]) =>
            board.isActive || mainBoard.mainBoardType === MainBoardType.RAG,
        )
        .map(([boardId, board]) => ({
          id:
            mainBoard.mainBoardType === MainBoardType.RAG
              ? (board as Collection).id
              : Number(boardId),
          key: `${board.name}-${
            mainBoard.mainBoardType === MainBoardType.RAG
              ? (board as Collection).id
              : boardId
          }`,
          title: board.name,
          url: "#",
          isActive: board.isSelected,
        })),
    }))
    .filter((mainBoard) => mainBoard.type !== MainBoardType.RAG)
}
