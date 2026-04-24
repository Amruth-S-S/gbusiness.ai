"use client"

import { ConsultantSidebar } from "@/components/ConsultantSidebar"
import { NavigationDropdown } from "@/components/molecules/dropdowns/navigation-dropdown/NavigationDropdown"
import { CenterModal } from "@/components/molecules/modal/CenterModal"
import { DynamicCreateBoardForm } from "@/components/organisms/forms/create-board-form/DynamicCreateBoardForm"
import SettingsView from "@/components/organisms/views/settings/SettingsView"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useModalContext } from "@/contexts/modal-context"
import { openModal } from "@/hooks/use-modal"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { cn } from "@/lib/utils"
import { useBoardsStore } from "@/store/boards"
import { useLanguagesStore } from "@/store/languages"
import { usePromptsStore } from "@/store/prompts"
import { Translator } from "gbusiness-ai-react-auto-translate"
import { usePathname, useSearchParams } from "next/navigation"
import { ReactNode, useEffect } from "react"
import "regenerator-runtime/runtime"
import { DynamicAnalysisFileUpload } from "../file-upload/analysis-dmt-file-upload/DynamicAnalysisFileUpload"
import { DynamicRagFileUpload } from "../file-upload/rag-file-upload/DynamicRagFileUpload"
import { DynamicAnalysisDMTForm } from "../forms/analysis-dmt-form/DynamicAnalysisDMTForm"
import { DynamicForecastForm } from "../forms/forecast-form/DynamicForecastForm"
import { DynamicPromptForm } from "../forms/prompt-form/DynamicPromptForm"
import { DynamicConsultantPromptsView } from "../views/consultant/prompts/DynamicConsultantPromptsView"
import { DynamicPromptsResultView } from "../views/prompts-result-view/DynamicPromptsResultsView"
import clsx from "clsx"

const SIDEBAR_SKIP_PATHS = [
  "/consultant/mainboard/[mainboardId]/board/[boardId]/prompt-results",
]

export function ConsultantDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const searchParams = useSearchParams()
  const boardId = searchParams.get("boardId")
  const googleTranslateApiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY

  if (!googleTranslateApiKey) {
    throw Error("Unable to get NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY")
  }

  const {
    modalState: { contentName, prevContentName, prevData, prevHeading },
    setModalState,
  } = useModalContext()
  const { lockScroll } = useScrollLock()

  const { selectedLang } = useLanguagesStore()
  const { executedPrompt } = usePromptsStore()
  const pathname = usePathname()

  const { fetchTreeInfo } = useBoardsStore()

  useEffect(() => {
    fetchTreeInfo()
  }, [])

  useEffect(() => {
    if (document.body.style.pointerEvents === "none") {
      document.body.style.pointerEvents = "auto"
    }

    const observer = new MutationObserver(() => {
      if (document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "auto"
      }
    })

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    })

    return () => observer.disconnect()
  }, [])

  const { charts, table, message } = executedPrompt

  const shouldHideSidebar = SIDEBAR_SKIP_PATHS.some((pattern) => {
    const dynamicRegex = pattern
      .replace(/\[.*?\]/g, "[^/]+")
      .replace(/\//g, "\\/")
    const fullRegex = new RegExp(`^${dynamicRegex}$`)
    return fullRegex.test(pathname || "")
  })

  return (
    <Translator
      from="en"
      to={selectedLang}
      googleApiKey={googleTranslateApiKey}
    >
      <SidebarProvider>
        <div className="w-screen h-screen flex overflow-x-hidden">
          {!shouldHideSidebar && <ConsultantSidebar />} {/* Sidebar */}
          {/* Main content area takes remaining width */}
          <div className="flex-1 w-full max-w-full overflow-x-hidden">
            {!shouldHideSidebar && (
              <div className="flex items-center justify-between mx-4 mt-4">
                <SidebarTrigger className="-ml-1" /> {/* Now inside provider */}
                <NavigationDropdown />
              </div>
            )}

            <div className="w-full max-w-full overflow-x-hidden">
              {children}
            </div>
          </div>
          {/* CenterModal outside flex row so it overlays properly */}
          <CenterModal
            contentClassName={cn(
              (contentName === "VIEW__PROMPTS_RESULT" ||
                contentName === "FORM__PROMPT" ||
                contentName === "FORM__FORECAST" ||
                contentName === "VIEW__CONSULTANT_PROMPTS_VIEW") &&
                "mt-[4%] h-[96%] !max-w-full",
              (contentName === "VIEW__CONSULTANT_PROMPTS_VIEW" ||
                contentName === "FORM__ANALYSIS_DMT") &&
                "p-4",
            )}
            backBtnClick={
              contentName === "FORM__PROMPT" &&
              prevContentName === "VIEW__CONSULTANT_PROMPTS_VIEW"
                ? () =>
                    openModal(setModalState, lockScroll, {
                      modalState: {
                        contentName: prevContentName,
                        data: prevData,
                        isActive: true,
                        isOpen: true,
                        heading: prevHeading,
                      },
                    })
                : undefined
            }
            dialogChildrenWrapperClassName={clsx(
              contentName === "VIEW__SETTINGS" &&
                "flex justify-center items-center",
            )}
          >
            <div className="w-full max-w-full overflow-x-hidden">
              {contentName === "VIEW__SETTINGS" && <SettingsView />}
              {contentName === "FORM__BOARD" && <DynamicCreateBoardForm />}
              {contentName === "FORM__PROMPT" && <DynamicPromptForm />}
              {contentName === "FORM__ANALYSIS_DMT" && (
                <DynamicAnalysisDMTForm />
              )}
              {contentName === "FORM__FORECAST" && (
                <DynamicForecastForm boardId={Number(boardId)} />
              )}
              {contentName === "VIEW__ANALYSIS_DMT_FILE_UPLOAD" && (
                <DynamicAnalysisFileUpload />
              )}
              {contentName === "VIEW__PROMPTS_RESULT" && (
                <DynamicPromptsResultView
                  charts={charts}
                  table={table}
                  message={message}
                  tabsListClassName="float-end"
                  tabClassName="pt-3 h-[90%] overflow-y-auto"
                />
              )}
              {contentName === "VIEW__CONSULTANT_PROMPTS_VIEW" && (
                <DynamicConsultantPromptsView boardId={Number(boardId)} />
              )}
              {contentName === "VIEW__RAG_FILE_UPLOAD" && (
                <DynamicRagFileUpload />
              )}
            </div>
          </CenterModal>
        </div>
      </SidebarProvider>
    </Translator>
  )
}
