import { MdDelete, MdEdit, MdMoreVert } from "react-icons/md"
import { useState } from "react"
import toast from "react-hot-toast"
import { BsFillGearFill } from "react-icons/bs"
import { HiMiniCircleStack } from "react-icons/hi2"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Paragraph } from "@/components/atoms/texts"
import { Button } from "@/components/ui/button"
import { fetchForecastData, useForecast } from "@/hooks/use-forecast"
import { openModal } from "@/hooks/use-modal"
import { AlertModal } from "@/components/molecules/modal/AlertModal"
import { useModalContext } from "@/contexts/modal-context"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { useForecastStore } from "@/store/forecast"
import { remove } from "@/services/utils"
import { CardComponent } from "@/components/atoms/controls/CardComponent"
import { cn } from "@/lib/utils"
import {
  DropdownMenuComponent,
  DropdownMenuOption,
} from "@/components/atoms/controls/DropdownMenuComponent"
import { usePromptsStore } from "@/store/prompts"

const dropdownOptions: DropdownMenuOption[] = [
  {
    icon: <BsFillGearFill className="my-1.5 mr-2 h-4 w-4" />,
    label: "Manage Prompts",
    value: "managePrompts",
  },
  {
    icon: <HiMiniCircleStack className="my-1.5 mr-2 h-4 w-4" />,
    label: "Prompts Repository",
    value: "promptsRepository",
  },
]

type ManageForecastViewProps = {
  boardId: number | null
  boardName?: string
  isCardReadOnly?: boolean
}

export function ManageForecastView({
  boardId,
  boardName,
  isCardReadOnly,
}: ManageForecastViewProps) {
  const { updatePromptsState } = usePromptsStore()
  const { setModalState } = useModalContext()
  const { lockScroll } = useScrollLock()
  useForecast(boardId)
  const { data, isLoading, updateForecastStore } = useForecastStore()
  const [selectedForecast, setSelectedForecast] = useState<number | null>(null)

  const alertActionBtnClickHandler = () => {
    if (selectedForecast && boardId) {
      remove(
        "/main-boards/boards/forecast-response/forecast_responses",
        selectedForecast,
      ).then(() => {
        toast.success("Deleted successfully")
        setSelectedForecast(null)
        fetchForecastData(updateForecastStore, boardId)
      })
    }
  }

  const clearPromptsHistory = () => {
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
    })
  }

  return (
    <div
      className={cn(
        "max-h-[calc(100vh_-_160px)] overflow-y-auto",
        isCardReadOnly && "px-4 sm:px-6 lg:px-8",
      )}
    >
      {!isLoading && !isCardReadOnly && (
        <Button
          className="float-end"
          onClick={() => {
            updateForecastStore({
              forecastResponse: null,
            })
            openModal(setModalState, lockScroll, {
              modalState: {
                isActive: true,
                isOpen: true,
                contentName: "FORM__FORECAST",
                heading: boardName,
              },
            })
          }}
        >
          <Translate>New</Translate>
        </Button>
      )}
      <div
        className={cn(
          "flex flex-wrap gap-4",
          !isCardReadOnly ? "pt-10" : "pt-4",
        )}
      >
        {!data?.length && !isLoading && !isCardReadOnly && (
          <CardComponent
            className="h-[175px] w-full flex-col items-center justify-center rounded-[20px] p-0 shadow-sm sm:w-60"
            cardContentClassName="h-full py-0"
            cardContent={
              <Button
                variant="destructive"
                className="h-full w-full flex-col items-center justify-center p-0 text-base font-semibold text-primary"
                onClick={() => {
                  updateForecastStore({
                    forecastResponse: null,
                  })
                  openModal(setModalState, lockScroll, {
                    modalState: {
                      isActive: true,
                      isOpen: true,
                      contentName: "FORM__FORECAST",
                      heading: boardName,
                    },
                  })
                }}
              >
                <Translate>New</Translate>
              </Button>
            }
          />
        )}
        {!isLoading &&
          data?.map((forecast) => (
            <CardComponent
              key={`forecast-${forecast.forecast_response_id}`}
              className="h-fit w-full flex-col justify-between rounded-[20px] p-0 shadow-sm sm:w-60"
              cardTitle={forecast.name}
              cardHeader={
                <Paragraph
                  text={forecast.name}
                  className="max-w-full truncate text-left text-base font-semibold text-[#333333]"
                />
              }
              cardContent={
                <Paragraph
                  text={new Date(forecast.updated_at).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                  className="text-left font-sans text-xs text-gray-600"
                />
              }
              cardFooterClassName="flex justify-center border-t border-gray-300"
              cardFooter={
                !isCardReadOnly ? (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        openModal(setModalState, lockScroll, {
                          modalState: {
                            isActive: true,
                            isOpen: true,
                            contentName: "FORM__FORECAST",
                            heading: boardName,
                            data: {
                              selectedForecastInfo: forecast,
                            },
                          },
                        })
                      }
                    >
                      <MdEdit size={20} />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedForecast(forecast.forecast_response_id)
                      }}
                    >
                      <MdDelete size={20} />
                    </Button>
                    <DropdownMenuComponent
                      options={dropdownOptions}
                      dropDownTrigger={
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setSelectedForecast(forecast.forecast_response_id)
                          }}
                        >
                          <MdMoreVert size={20} />
                        </Button>
                      }
                      menuItemClickHandler={(val) => {
                        clearPromptsHistory()
                        if (val === "managePrompts") {
                          openModal(setModalState, lockScroll, {
                            modalState: {
                              isActive: true,
                              isOpen: true,
                              contentName: "VIEW__CONSULTANT_PROMPTS_VIEW",
                              heading: boardName,
                              data: {
                                apiKey:
                                  "forecast-chat-response/forecast_response_id",
                                secondaryApiKey:
                                  "forecast-response/chat_integration",
                                isCardReadOnly: false,
                                forecastPeriod: forecast.forecast_period,
                                forecastResponseId:
                                  forecast.forecast_response_id,
                                firstLevelFilter: forecast.first_level_filter,
                                secondLevelFilter: forecast.second_level_filter,
                              },
                            },
                          })
                        } else if (val === "promptsRepository") {
                          openModal(setModalState, lockScroll, {
                            modalState: {
                              isActive: true,
                              isOpen: true,
                              contentName: "VIEW__CONSULTANT_PROMPTS_VIEW",
                              heading: boardName,
                              data: {
                                apiKey:
                                  "forecast-chat-response/forecast_response_id",
                                secondaryApiKey:
                                  "forecast-response/chat_integration",
                                isCardReadOnly: true,
                                forecastPeriod: forecast.forecast_period,
                                forecastResponseId:
                                  forecast.forecast_response_id,
                                firstLevelFilter: forecast.first_level_filter,
                                secondLevelFilter: forecast.second_level_filter,
                              },
                            },
                          })
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      variant="destructive"
                      className="text-primary"
                      onClick={() =>
                        openModal(setModalState, lockScroll, {
                          modalState: {
                            isActive: true,
                            isOpen: true,
                            contentName: "FORM__FORECAST",
                            heading: boardName,
                            data: {
                              selectedForecastInfo: forecast,
                            },
                          },
                        })
                      }
                    >
                      <Translate>Run Forecast</Translate>
                    </Button>
                    <Button
                      variant="destructive"
                      className="text-primary"
                      onClick={() => {
                        clearPromptsHistory()
                        openModal(setModalState, lockScroll, {
                          modalState: {
                            isActive: true,
                            isOpen: true,
                            contentName: "FORM__PROMPT_ENTRY",
                            heading: boardName ?? forecast.name,
                            data: {
                              apiKey:
                                "forecast-chat-response/forecast_response_id",
                              secondaryApiKey:
                                "forecast-response/chat_integration",
                              isCardReadOnly: true,
                              forecastPeriod: forecast.forecast_period,
                              forecastResponseId: forecast.forecast_response_id,
                              firstLevelFilter: forecast.first_level_filter,
                              secondLevelFilter: forecast.second_level_filter,
                            },
                          },
                        })
                      }}
                    >
                      <Translate>Run Prompt</Translate>
                    </Button>
                  </>
                )
              }
            />
          ))}
      </div>
      <AlertModal
        isOpen={!!selectedForecast}
        onCancelClick={() => setSelectedForecast(null)}
        onActionClick={alertActionBtnClickHandler}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete forecast and its data"
      />
    </div>
  )
}
