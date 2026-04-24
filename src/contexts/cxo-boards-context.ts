import { createContext, useContext } from "react"
import { RUseCXOBoards } from "@/hooks/use-cxo-boards"

export interface RCXOBoardsContext extends RUseCXOBoards {}

export const CXOBoardsContext = createContext<RUseCXOBoards | undefined>(
  undefined,
)

type UseCXOBoardsContext = () => RCXOBoardsContext

export const useCXOBoardsContext: UseCXOBoardsContext = () => {
  const cxoBoardsContext = useContext(CXOBoardsContext)

  if (!cxoBoardsContext) {
    throw new Error("cxo-boards context is undefined")
  }

  return cxoBoardsContext
}
