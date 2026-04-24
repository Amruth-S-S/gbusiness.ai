import { useEffect, useState } from "react"
import { HiMiniHome } from "react-icons/hi2"
import toast from "react-hot-toast"
import { useParams, usePathname, useRouter } from "next/navigation"
import { Heading } from "@/components/atoms/texts"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { openModal } from "@/hooks/use-modal"
import { useModalContext } from "@/contexts/modal-context"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { deletePromptById } from "@/services"
import { AlertModal } from "@/components/molecules/modal/AlertModal"
import { SettingsViewProps } from "@/lib/props"
import { post, remove } from "@/services/utils"
import { baseUrl } from "@/lib/constants"
import { DynamicPromptsResultView } from "../../prompts-result-view/DynamicPromptsResultsView"
import { usePromptsStore } from "@/store/prompts"
import { PromptsCards } from "@/components/organisms/cards/prompts-card/PromptsCard"

type ConsultantPromptsViewProps = Partial<
  SettingsViewProps & {
    isCardReadOnly: boolean
  }
> & {
  boardId: number | null
}

const accessibleAPIKeys = ["prompts/boards"]

export function ConsultantPromptsView({
  isCardReadOnly,
  info,
  boardId,
}: ConsultantPromptsViewProps) {
  const router = useRouter()
  const { mainBoardId } = useParams()
  const pathName = usePathname()
  const {
    modalState: { prevContentName, heading, data: modalData },
    setModalState,
  } = useModalContext()
  const modalDataInfo = modalData as {
    apiKey: string
    secondaryApiKey: string
    isCardReadOnly: boolean
    forecastPeriod: number
    forecastResponseId: number
    firstLevelFilter: string
    secondLevelFilter: string
  }
  if (!modalData && !info) {
    return null
  }

  const apiKey = info?.apiKey || modalDataInfo?.apiKey
  const secondaryApiKey =
    info?.secondaryApiKey || modalDataInfo?.secondaryApiKey

  const { executedPrompt, fetchPrompts, updatePromptsState, data, isLoading } =
    usePromptsStore()

  const { lockScroll } = useScrollLock()
  const [selectedPrompt, setSelectedPrompt] = useState<{
    id: number
    type: "edit" | "delete" | "view"
  } | null>(null)

  const alertActionBtnClickHandler = () => {
    if (selectedPrompt?.id && boardId) {
      if (modalDataInfo?.forecastResponseId) {
        remove(
          "/main-boards/boards/forecast-chat-response/id",
          selectedPrompt.id,
        ).then(() => {
          setSelectedPrompt(null)
          fetchPrompts(apiKey, boardId)
        })
      } else {
        deletePromptById(selectedPrompt.id).then(() => {
          setSelectedPrompt(null)
          fetchPrompts(apiKey, boardId)
        })
      }
    }
  }

  const runPromptHandler = (
    promptNumber: number,
    promptText: string | undefined,
    shouldOpenInModal?: boolean,
  ) => {
    if (promptText && boardId && secondaryApiKey) {
      updatePromptsState({
        selectedPromptInfo: null,
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
        promptNumber: null,
      })
      const url = new URL(`/main-boards/boards/${secondaryApiKey}`, baseUrl)
      url.searchParams.append("input_text", promptText)
      url.searchParams.append("board_id", boardId?.toString())
      url.searchParams.append("use_cache", "true")
      if (modalDataInfo) {
        url.searchParams.append(
          "forecast_response_id",
          modalDataInfo?.forecastResponseId?.toString(),
        )
        url.searchParams.append(
          "first_level_filter",
          modalDataInfo?.firstLevelFilter,
        )
        url.searchParams.append(
          "forecast_period",
          modalDataInfo?.forecastPeriod?.toString(),
        )
      }
      if (modalDataInfo?.secondLevelFilter) {
        url.searchParams.append(
          "second_level_filter",
          modalDataInfo?.secondLevelFilter,
        )
      }
      post(url.href)
        .then((response) => {
          if (Array.isArray(response.data.message)) {
            updatePromptsState({
              executedPrompt: response.data,
              promptNumber,
            })
            if (shouldOpenInModal) {
              router.push(
                `/consultant/mainboard/${mainBoardId}/board/${boardId}/prompt-results`,
              )
              // openModal(setModalState, lockScroll, {
              //   modalState: {
              //     isActive: true,
              //     isOpen: true,
              //     contentName: "VIEW__PROMPTS_RESULT",
              //     heading: heading ?? promptText,
              //     data: {
              //       apiKey,
              //       secondaryApiKey,
              //       isCardReadOnly: modalDataInfo?.isCardReadOnly,
              //       forecastPeriod: modalDataInfo?.forecastPeriod,
              //       forecastResponseId: modalDataInfo?.forecastResponseId,
              //       firstLevelFilter: modalDataInfo?.firstLevelFilter,
              //       secondLevelFilter: modalDataInfo?.secondLevelFilter,
              //     },
              //   },
              // })
            }
          } else {
            toast.error(
              "Please review and modify the prompt with more specifics.",
            )
            updatePromptsState({
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
              promptNumber: null,
            })
          }
        })
        .catch(() => {
          toast.error(
            "Please review and modify the prompt with more specifics.",
          )
          updatePromptsState({
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
            promptNumber: null,
          })
        })
    }
  }

  useEffect(() => {
    if (
      prevContentName === "FORM__PROMPT" ||
      prevContentName === "VIEW__PROMPTS_RESULT"
    ) {
      setSelectedPrompt(null)
    }
  }, [prevContentName])

  useEffect(() => {
    if (boardId && apiKey && accessibleAPIKeys.includes(apiKey)) {
      fetchPrompts(apiKey, modalDataInfo?.forecastResponseId ?? boardId)
    }
  }, [boardId, apiKey])

  return (
    <>
      <div
        className={cn(
          "my-4 flex items-center",
          modalDataInfo ? "justify-end" : "justify-between",
        )}
      >
        {!modalDataInfo && (
          <div className="relative z-10 flex items-center">
            {selectedPrompt && (
              <Button
                title="Back"
                variant="destructive"
                onClick={() => {
                  updatePromptsState({
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
                    promptNumber: null,
                  })
                  setSelectedPrompt(null)
                }}
              >
                <HiMiniHome size={24} className="text-primary" />
              </Button>
            )}
            <Heading
              text={heading}
              className="text-xl font-semibold text-primary"
            />
          </div>
        )}
      </div>
      <PromptsCards
        prompts={data ?? []}
        onNewBtnClick={() => {
          openModal(setModalState, lockScroll, {
            modalState: {
              isActive: true,
              isOpen: true,
              contentName: "FORM__PROMPT",
              data: {
                selectedPromptInfo: null,
                apiKey,
                secondaryApiKey,
                isCardReadOnly: modalDataInfo?.isCardReadOnly,
                forecastPeriod: modalDataInfo?.forecastPeriod,
                forecastResponseId: modalDataInfo?.forecastResponseId,
                firstLevelFilter: modalDataInfo?.firstLevelFilter,
                secondLevelFilter: modalDataInfo?.secondLevelFilter,
              },
              heading,
            },
          })
        }}
        onRun={(prompt, promptNumber) =>
          runPromptHandler(promptNumber, prompt.prompt_text, true)
        }
        onEdit={(prompt) =>
          openModal(setModalState, lockScroll, {
            modalState: {
              isActive: true,
              isOpen: true,
              contentName: "FORM__PROMPT",
              data: {
                selectedPromptInfo: {
                  ...prompt,
                  promptId: prompt.id,
                  promptText: prompt.prompt_text,
                },
                apiKey,
                secondaryApiKey,
                isCardReadOnly: modalDataInfo?.isCardReadOnly,
                forecastPeriod: modalDataInfo?.forecastPeriod,
                forecastResponseId: modalDataInfo?.forecastResponseId,
                firstLevelFilter: modalDataInfo?.firstLevelFilter,
                secondLevelFilter: modalDataInfo?.secondLevelFilter,
              },
              heading,
            },
          })
        }
        onDelete={(prompt) =>
          setSelectedPrompt({ id: prompt.id, type: "delete" })
        }
        isPromptManagementDisabled={!!isCardReadOnly}
        isPromptSelected={!!selectedPrompt}
        isLoading={isLoading}
      />
      {/* {!selectedPrompt && (
        <div className="flex h-[calc(100vh_-_140px)] flex-wrap gap-4 overflow-y-auto">
          <Suspense
            fallback={
              <DataTableSkeleton
                columnCount={7}
                filterCount={2}
                cellWidths={["10rem", "60rem", "6rem"]}
                shrinkZero
              />
            }
          >
            <PromptsTable
              onNewBtnClick={() => {
                openModal(setModalState, lockScroll, {
                  modalState: {
                    isActive: true,
                    isOpen: true,
                    contentName: "FORM__PROMPT",
                    data: {
                      selectedPromptInfo: null,
                      apiKey,
                      secondaryApiKey,
                      isCardReadOnly: modalDataInfo?.isCardReadOnly,
                      forecastPeriod: modalDataInfo?.forecastPeriod,
                      forecastResponseId: modalDataInfo?.forecastResponseId,
                      firstLevelFilter: modalDataInfo?.firstLevelFilter,
                      secondLevelFilter: modalDataInfo?.secondLevelFilter,
                    },
                    heading,
                  },
                })
              }}
              onRun={(prompt) =>
                runPromptHandler(prompt.id, prompt.prompt_text, true)
              }
              onEdit={(prompt) =>
                openModal(setModalState, lockScroll, {
                  modalState: {
                    isActive: true,
                    isOpen: true,
                    contentName: "FORM__PROMPT",
                    data: {
                      selectedPromptInfo: {
                        ...prompt,
                        promptId: prompt.id,
                        promptText: prompt.prompt_text,
                      },
                      apiKey,
                      secondaryApiKey,
                      isCardReadOnly: modalDataInfo?.isCardReadOnly,
                      forecastPeriod: modalDataInfo?.forecastPeriod,
                      forecastResponseId: modalDataInfo?.forecastResponseId,
                      firstLevelFilter: modalDataInfo?.firstLevelFilter,
                      secondLevelFilter: modalDataInfo?.secondLevelFilter,
                    },
                    heading,
                  },
                })
              }
              onDelete={(prompt) =>
                setSelectedPrompt({ id: prompt.id, type: "delete" })
              }
              isPromptManagementDisabled={!!isCardReadOnly}
            />
          </Suspense>
        </div>
      )} */}
      {selectedPrompt?.type === "view" && (
        <DynamicPromptsResultView
          tabsListClassName="float-end"
          tabClassName={cn(
            "h-[calc(100vh_-_160px)] overflow-y-auto",
            !pathName.includes("cxo") && "!-mt-14",
          )}
          {...executedPrompt}
        />
      )}
      <AlertModal
        isOpen={!!(selectedPrompt && selectedPrompt.type === "delete")}
        onCancelClick={() => setSelectedPrompt(null)}
        onActionClick={alertActionBtnClickHandler}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete prompt and its data"
      />
    </>
  )
}
