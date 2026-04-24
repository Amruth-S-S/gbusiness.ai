/* eslint-disable camelcase */

"use-client"

import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { CenterModal } from "@/components/molecules/modal/CenterModal"
import { DynamicPromptEntryForm } from "@/components/organisms/forms/dynamic-prompt-form/DynamicPromptEntryForm"
import { DynamicForecastForm } from "@/components/organisms/forms/forecast-form/DynamicForecastForm"
import { DynamicPromptForm } from "@/components/organisms/forms/prompt-form/DynamicPromptForm"
import { CXOBoardsContext } from "@/contexts/cxo-boards-context"
import { useModalContext } from "@/contexts/modal-context"
import { RUseCXOBoards, useCXOBoards } from "@/hooks/use-cxo-boards"
import { MainBoardType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { DynamicConsultantPromptsView } from "../../../consultant/prompts/DynamicConsultantPromptsView"
import { DynamicChatView } from "../../../consultant/rag/chat/DynamicChatView"
import { DynamicPromptsResultView } from "../../../prompts-result-view/DynamicPromptsResultsView"
import { CXOPromptsPanel } from "../../prompts-panel/CXOPromptsPanel"
import { TabsView } from "../../tabs-view/TabsView"

export function CXOBoard() {
  const { boardId, mainBoardId } = useParams()
  const { cxoBoardsState, setCXOBoardsState } = useCXOBoards()
  const {
    modalState: { contentName },
  } = useModalContext()

  const cxoBoardsMemoState = useMemo<RUseCXOBoards>(
    () => ({ cxoBoardsState, setCXOBoardsState }),
    [cxoBoardsState, setCXOBoardsState],
  )

  const [boardType, setBoardType] = useState<MainBoardType | null>(null)
  const { charts, message, table, prompt_text } = cxoBoardsState.executedPrompt

  useEffect(() => {
    if (mainBoardId && boardId && cxoBoardsState.data.length) {
      const tempBoardType = cxoBoardsState.data.find(
        (mainBoard) => mainBoard.mainBoardId === Number(mainBoardId),
      )
      if (tempBoardType) {
        setCXOBoardsState((prev) => ({
          ...prev,
          boardType: tempBoardType.mainBoardType,
        }))
        setBoardType(tempBoardType.mainBoardType)
      }
    }
  }, [boardId, mainBoardId, cxoBoardsState.data])

  const showResults = charts?.length || table?.columns || message.length

  return (
    <CXOBoardsContext.Provider value={cxoBoardsMemoState}>
      <div
        className={cn(
          "flex",
          !showResults && boardType === "ANALYSIS"
            ? "h-[calc(100%_-_105px)]"
            : "mt-4",
          !!showResults && "h-[calc(100vh_-_105px)] flex-col justify-between",
          boardType === "RAG" && "hidden",
        )}
      >
        {boardType === "ANALYSIS" && !!showResults && (
          <DynamicPromptsResultView
            charts={charts}
            table={table}
            message={message}
            promptText={prompt_text}
            tabClassName="mt-0 h-[calc(100%_-_64px)] overflow-y-auto"
            tabsListClassName="float-end mr-4 sm:mr-6 lg:mr-8"
          />
        )}
        {boardType === "ANALYSIS" && <DynamicPromptEntryForm />}
        {boardType !== "ANALYSIS" && boardType && (
          <TabsView boardType={boardType} />
        )}
      </div>
      {boardType === "ANALYSIS" && <CXOPromptsPanel />}
      <div className="mx-4 sm:mx-6 lg:mx-8">
        {boardType === "RAG" && (
          <DynamicChatView
            boardId={Number(boardId)}
            messageWrapperClassName="max-h-[76vh]"
          />
        )}
      </div>
      <CenterModal
        contentClassName={cn(
          (contentName === "FORM__PROMPT" ||
            contentName === "FORM__FORECAST" ||
            contentName === "VIEW__CONSULTANT_PROMPTS_VIEW" ||
            contentName === "FORM__PROMPT_ENTRY") &&
            "mt-[4%] h-[96%] !max-w-[100%]",
        )}
        onCloseModal={() =>
          setCXOBoardsState((prevState) => ({
            ...prevState,
            selectedPrompt: null,
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
          }))
        }
      >
        {contentName === "FORM__PROMPT" && <DynamicPromptForm />}
        {contentName === "FORM__FORECAST" && (
          <DynamicForecastForm boardId={Number(boardId)} isReadOnly />
        )}
        {contentName === "VIEW__CONSULTANT_PROMPTS_VIEW" && (
          <DynamicConsultantPromptsView
            boardId={Number(boardId)}
            isCardReadOnly
          />
        )}
        {contentName === "FORM__PROMPT_ENTRY" && (
          <>
            {!!showResults && (
              <DynamicPromptsResultView
                charts={charts}
                table={table}
                message={message}
                promptText={prompt_text}
                tabClassName="mt-0 h-[calc(100vh_-_370px)] overflow-y-auto"
                tabsListClassName="float-end mr-4 sm:mr-6 lg:mr-8"
              />
            )}
            <DynamicPromptEntryForm />
            <CXOPromptsPanel />
          </>
        )}
      </CenterModal>
    </CXOBoardsContext.Provider>
  )
}
