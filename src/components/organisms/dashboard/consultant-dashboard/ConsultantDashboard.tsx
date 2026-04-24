"use client"

import { useEffect } from "react"
import { getMainBoards } from "@/lib/main-boards"
import { useBoardsStore } from "@/store/boards"
import { useCollectionsStore } from "@/store/collections"
import { DynamicMiddlePane } from "../../board/middle-pane/DynamicMiddlePane"

type ConsultantDashboardProps = {
  mainBoardId: string
  boardId: string
}

export function ConsultantDashboard({
  mainBoardId,
  boardId,
}: ConsultantDashboardProps) {
  const collectionsStore = useCollectionsStore()
  const { treeNodes, updateBoardsState } = useBoardsStore()

  const initializeBoardSelection = () => {
    const mainBoards = getMainBoards(treeNodes, collectionsStore)
    const selectedMainBoard = mainBoards.find(
      (mainBoard) => mainBoard.id === Number(mainBoardId),
    )
    const selectedBoard = selectedMainBoard?.boards.find(
      (board) => board.id === Number(boardId),
    )

    if (selectedBoard) {
      updateBoardsState({
        selectedMainBoard,
        selectedBoard,
      })
    }
  }

  useEffect(() => {
    initializeBoardSelection()
  }, [boardId, mainBoardId, treeNodes, collectionsStore])

  return <DynamicMiddlePane />
}
