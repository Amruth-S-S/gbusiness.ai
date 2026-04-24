/* eslint-disable camelcase */
import { useMemo, useState } from "react"
import { CXOBoardsContext } from "@/contexts/cxo-boards-context"
import { RUseCXOBoards, useCXOBoards } from "@/hooks/use-cxo-boards"
import { cn } from "@/lib/utils"
import { DynamicCXOBoardsList } from "../../lists/cxo-boards-list/DynamicCXOBoardsList"
import { DynamicPromptEntryForm } from "../../forms/dynamic-prompt-form/DynamicPromptEntryForm"
import { DynamicPromptsResultView } from "../../views/prompts-result-view/DynamicPromptsResultsView"

type SelectedTab = "all" | "today" | "week" | "month"

type TabList = {
  label: string
  value: SelectedTab
}

const tabsList: TabList[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Week",
    value: "week",
  },
  {
    label: "Month",
    value: "month",
  },
]

export function CXODashboard() {
  const { cxoBoardsState, setCXOBoardsState } = useCXOBoards()

  const cfoBoardsMemoState = useMemo<RUseCXOBoards>(
    () => ({ cxoBoardsState, setCXOBoardsState }),
    [cxoBoardsState, setCXOBoardsState],
  )

  const { selectedCXOBoardInfo, executedPrompt } = cxoBoardsState
  const { charts, message, table, prompt_text } = executedPrompt

  const [searchValue] = useState("")
  const [selectedTab] = useState<SelectedTab>(tabsList[0].value)

  const showResults = charts?.length || table?.columns || message.length

  return (
    <CXOBoardsContext.Provider value={cfoBoardsMemoState}>
      <div
        className={cn(
          "flex items-center justify-between px-4 max-sm:flex-col max-sm:gap-2 sm:px-6 lg:px-8",
        )}
      >
        {/* {!selectedCFOBoardInfo?.boardId && !showResults ? (
          <Search
            placeholder="Search boards"
            containerClassName="sm:w-1/2"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        ) : (
          <div className="ml-1.5 flex items-center gap-x-1">
            <div onClick={backBtnClickHandler} className="p-0" role="button" tabIndex={0}>
              <Tooltip>
                <TooltipTrigger>
                  <HiMiniHome size={24} className="mt-1 text-primary" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <HiChevronRight size={24} />
            <Heading
              text={selectedCFOBoardInfo?.boardName ?? ""}
              type="h4"
              className="font-medium text-primary"
            />
          </div>
        )} */}

        {/* {!selectedCFOBoardInfo?.boardId && !showResults && (
              <TabComponent
                tabsList={tabsList}
                tabsListClassName="float-end"
                value={selectedTab}
                onValueChange={(tab) => setSelectedTab(tab as SelectedTab)}
              />
            )} */}
      </div>
      <div
        className={cn(
          "flex",
          selectedCXOBoardInfo?.boardId &&
            !showResults &&
            "h-[calc(100%_-_105px)] items-center",
          selectedCXOBoardInfo?.boardId &&
            !!showResults &&
            "h-[calc(100%_-_105px)] flex-col justify-between",
        )}
      >
        {!selectedCXOBoardInfo?.boardId && !showResults && (
          <DynamicCXOBoardsList
            searchValue={searchValue}
            selectedTab={selectedTab}
          />
        )}
        {selectedCXOBoardInfo?.boardId && !!showResults && (
          <DynamicPromptsResultView
            charts={charts}
            table={table}
            message={message}
            promptText={prompt_text}
            tabClassName="mt-5 h-[calc(100%_-_64px)] overflow-y-auto"
            tabsListClassName="float-end mr-4 sm:mr-6 lg:mr-8"
          />
        )}
        {selectedCXOBoardInfo?.boardId && <DynamicPromptEntryForm />}
      </div>
    </CXOBoardsContext.Provider>
  )
}
