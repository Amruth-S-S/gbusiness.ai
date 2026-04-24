"use-client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { CXOBoardsContext } from "@/contexts/cxo-boards-context"
import { RUseCXOBoards, useCXOBoards } from "@/hooks/use-cxo-boards"
import { CardComponent } from "@/components/atoms/controls/CardComponent"
import { Heading } from "@/components/atoms/texts"
import { useCollectionsStore } from "@/store/collections"
import { useCollections } from "@/hooks/use-collections"

type BoardsState = {
  id: number
  name: string
}

export function CXOMainBoards() {
  const { mainBoardId } = useParams()
  const { cxoBoardsState, setCXOBoardsState } = useCXOBoards()

  useCollections()

  const { data: collectionsData } = useCollectionsStore()

  const cxoBoardsMemoState = useMemo<RUseCXOBoards>(
    () => ({ cxoBoardsState, setCXOBoardsState }),
    [cxoBoardsState, setCXOBoardsState],
  )

  const [boards, setBoards] = useState<BoardsState[]>([])

  useEffect(() => {
    if (cxoBoardsState.data.length) {
      const selectedMainBoard = cxoBoardsState.data.find(
        (i) => i.mainBoardId === Number(mainBoardId),
      )

      if (selectedMainBoard) {
        if (selectedMainBoard.mainBoardType === "RAG") {
          setBoards(
            collectionsData.map((collection) => ({
              id: collection.id,
              name: collection.name,
            })),
          )
        } else {
          const filteredValues = Object.entries(selectedMainBoard.boards)
            .filter(([, board]) => board.isActive)
            ?.map(([id, board]) => ({
              id: Number(id),
              name: board.name,
            }))
          setBoards(filteredValues)
        }
      }
    }
  }, [cxoBoardsState.data])

  return (
    <CXOBoardsContext.Provider value={cxoBoardsMemoState}>
      <div className="mt-8 flex h-[calc(100vh_-_160px)] flex-wrap content-baseline gap-8 overflow-y-auto p-4 max-sm:h-[calc(100vh_-_270px)] sm:pl-6 lg:pl-8">
        <div className="flex flex-wrap justify-center gap-20">
          {boards?.map((board) => (
            <Link
              key={board.id}
              href={`/cxo/main-boards/${mainBoardId}/boards/${board.id}`}
              className="group h-[200px] w-[300px]"
            >
              <CardComponent
                cardContentClassName="h-full"
                className="h-full w-full group-hover:cursor-pointer group-hover:shadow-primary"
                cardContent={
                  <div className="flex h-full flex-col items-center justify-center gap-10 p-5">
                    <Heading
                      text={board.name}
                      type="h1"
                      className="text-xl text-primary"
                    />
                  </div>
                }
              />
            </Link>
          ))}
        </div>
      </div>
    </CXOBoardsContext.Provider>
  )
}
