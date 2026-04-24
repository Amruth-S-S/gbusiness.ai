import { useEffect, useState } from "react"
import Link from "next/link"
import { MdChevronLeft } from "react-icons/md"
import Image from "next/image"
import { Heading } from "@/components/atoms/texts"
import { useCXOBoardsContext } from "@/contexts/cxo-boards-context"
import type { MainBoardType } from "@/lib/types"
import { CardComponent } from "@/components/atoms/controls/CardComponent"
import { Button } from "@/components/ui/button"

type CXOBoardsListProps = {
  searchValue: string
  selectedTab: "all" | "today" | "week" | "month"
}

type MainCategory = {
  id: number
  name: string
  type: MainBoardType
  imageUrl: string
}

type CategoriesState = MainCategory & {
  subCategories?: MainCategory[]
}

export const labels: Partial<Record<MainBoardType, string>> = {
  KPI_DEFINITION: "Business Alignment",
  USE_CASES: "Governance",
}

const getImageUrl = (mainBoardType: MainBoardType) => {
  if (mainBoardType === "ANALYSIS") return "/images/analysis.png"
  if (mainBoardType === "RAG") return "/images/document-analysis.png"
  if (mainBoardType === "FORECAST") return "/images/forecast.png"
  return "/images/default-main-board.png"
}

export function CXOBoardsList({
  searchValue,
  selectedTab,
}: CXOBoardsListProps) {
  const {
    cxoBoardsState: { data, isLoading },
  } = useCXOBoardsContext()

  const [categories, setCategories] = useState<CategoriesState[]>([])
  const [selectedCard, setSelectedCard] = useState<MainBoardType | null>(null)

  useEffect(() => {
    const sortOrder: Record<string, number> = {
      ANALYSIS: 0,
      RAG: 1,
      FORECAST: 2,
    }

    setCategories(
      data
        .slice()
        .sort((a, b) => sortOrder[a.mainBoardType] - sortOrder[b.mainBoardType])
        .map((board) => ({
          ...board,
          id: board.mainBoardId,
          type: board.mainBoardType,
          imageUrl: getImageUrl(board.mainBoardType),
        })),
    )
  }, [searchValue, selectedTab, data])

  return (
    <div className="mt-4 flex h-[calc(100vh_-_100px)] flex-wrap content-baseline gap-8 overflow-y-auto p-4 max-sm:h-[calc(100vh_-_200px)] sm:pl-6 lg:pl-8">
      {!!selectedCard && (
        <div className="ml-1.5 flex items-center gap-x-1">
          <Button
            onClick={() => setSelectedCard(null)}
            className="p-0"
            variant="destructive"
          >
            <MdChevronLeft size={24} className="mt-1 text-primary" />
          </Button>
          <Heading
            text={selectedCard === "USE_CASES" ? "Use Cases" : "KPI Framework"}
            type="h4"
            className="mt-0.5 font-medium text-primary"
          />
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-10 px-4 sm:gap-14 lg:gap-20">
        {!selectedCard &&
          !isLoading &&
          categories?.map((cat) =>
            cat.type === "USE_CASES" || cat.type === "KPI_DEFINITION" ? (
              <Button
                key={cat.id}
                variant="ghost"
                className="group h-[220px] w-[300px] p-0 transition-transform duration-300 hover:scale-105"
                onClick={() => setSelectedCard(cat.type)}
              >
                <CardComponent
                  cardContentClassName="h-full"
                  className="h-full w-full rounded-2xl border border-muted bg-white shadow-md hover:shadow-lg"
                  cardContent={
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
                      <Heading
                        text={cat.name}
                        type="h2"
                        className="text-lg font-semibold italic text-primary text-center"
                      />
                    </div>
                  }
                />
              </Button>
            ) : (
              <Link
                key={cat.id}
                href={`/cxo/main-boards/${cat.id}`}
                className="group h-[220px] w-full sm:w-[300px] transition-transform duration-300 hover:scale-105"
              >
                <CardComponent
                  cardContentClassName="h-full"
                  className="h-full w-full rounded-2xl border border-muted bg-white shadow-md hover:shadow-lg"
                  cardContent={
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
                      <div className="relative h-[100px] w-[100px] rounded-full p-2">
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                      <Heading
                        text={cat.name}
                        type="h2"
                        className="text-lg font-semibold italic text-primary text-center"
                      />
                    </div>
                  }
                />
              </Link>
            ),
          )}

        {selectedCard === "USE_CASES" &&
          !isLoading &&
          categories
            .find((cat) => cat.type === "USE_CASES")
            ?.subCategories?.map((sub) => (
              <Link
                key={sub.id}
                href={`/cfo/main-boards/${sub.id}`}
                className="group h-[220px] w-[300px] transition-transform duration-300 hover:scale-105"
              >
                <CardComponent
                  cardContentClassName="h-full"
                  className="h-full w-full rounded-2xl border border-muted bg-white shadow-md hover:shadow-lg"
                  cardContent={
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
                      <Heading
                        text={sub.name}
                        type="h2"
                        className="text-lg italic text-primary text-center"
                      />
                    </div>
                  }
                />
              </Link>
            ))}

        {selectedCard === "KPI_DEFINITION" &&
          categories.findIndex((cat) => cat.type === "KPI_DEFINITION") !==
            -1 && (
            <div className="flex h-[calc(100vh_-_300px)] w-[calc(100vw_-_100px)] items-center justify-center">
              <Heading
                text="Will be developed for the Customer"
                className="text-2xl font-semibold"
              />
            </div>
          )}
      </div>
    </div>
  )
}
