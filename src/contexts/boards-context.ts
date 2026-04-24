import { createContext, useContext } from "react"
import { RUseBoards } from "@/hooks/use-boards"

export interface RBoardsContext extends RUseBoards {}

export const BoardsContext = createContext<RUseBoards | undefined>(undefined)

type UseBoardsContext = () => RBoardsContext

export const useBoardContext: UseBoardsContext = () => {
  const boardsContext = useContext(BoardsContext)

  if (!boardsContext) {
    throw new Error("boards context is undefined")
  }

  return boardsContext
}
