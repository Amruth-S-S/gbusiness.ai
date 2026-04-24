/* eslint-disable react/no-unescaped-entities */
import { InputField } from "@/components/molecules/fields/InputField"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useAuth } from "@/contexts/auth-context"
import { useCXOBoardsContext } from "@/contexts/cxo-boards-context"
import { useModalContext } from "@/contexts/modal-context"
import { baseUrl } from "@/lib/constants"
import { fetchWrapper } from "@/lib/fetch-wrapper"
import { cn } from "@/lib/utils"
import { createPrompt } from "@/services"
import { get, post } from "@/services/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { useParams } from "next/navigation"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FaPlay } from "react-icons/fa"
import { FaMicrophone } from "react-icons/fa6"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import * as z from "zod"

export function PromptEntryForm() {
  const { user } = useAuth()
  const { boardId, mainBoardId } = useParams()
  const {
    modalState: { data: modalData },
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
  const {
    cxoBoardsState: { selectedPrompt, boardType },
    setCXOBoardsState,
  } = useCXOBoardsContext()
  const promptFormSchema = z.object({
    promptText: z.string().min(1, " "),
  })

  type PromptFormValues = z.infer<typeof promptFormSchema>

  const defaultValues: Partial<PromptFormValues> = {
    promptText: selectedPrompt ?? "",
  }

  const values: PromptFormValues = {
    promptText: selectedPrompt ?? "",
  }

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues,
    values,
  })

  async function onRePrompt(data: PromptFormValues) {
    if (boardId) {
      const url = new URL("main-boards/boards/prompts/re_prompt", baseUrl)
      url.searchParams.append("input_text", data.promptText)
      url.searchParams.append("board_id", boardId.toString())

      const { data: res, error } = await fetchWrapper(url.href, {
        method: "POST",
        body: data,
      })

      const promptText = res as string
      if (promptText) {
        form.setValue("promptText", promptText)
      }

      const errRes = (error as any)?.response?.data || "Something went wrong"
      toast.error(
        (Object.hasOwn(errRes, "detail") &&
          Object.hasOwn(errRes.detail, "message") &&
          Array.isArray(errRes.detail.message) &&
          errRes.detail.message.length &&
          errRes.detail.message[0]) ??
          "Something went wrong",
        { position: "top-right" },
      )
    }
  }

  async function onSubmit(data: PromptFormValues) {
    if (boardId) {
      const url = new URL(
        boardType === "FORECAST"
          ? `/main-boards/boards/forecast-response/chat_integration`
          : `/main-boards/boards/prompts/run_prompt_v2`,
        baseUrl,
      )
      url.searchParams.append("input_text", data.promptText)
      url.searchParams.append("input_text", data.promptText)
      url.searchParams.append("board_id", boardId.toString())
      url.searchParams.append("use_cache", "true")
      if (modalDataInfo) {
        url.searchParams.append(
          "forecast_response_id",
          modalDataInfo?.forecastResponseId.toString(),
        )
        url.searchParams.append(
          "first_level_filter",
          modalDataInfo?.firstLevelFilter,
        )
        url.searchParams.append(
          "forecast_period",
          modalDataInfo?.forecastPeriod.toString(),
        )
      }
      if (modalDataInfo?.secondLevelFilter) {
        url.searchParams.append(
          "second_level_filter",
          modalDataInfo?.secondLevelFilter,
        )
      }

      post(url.href)
        .then((res) => {
          const promptData = res && res.data
          if (
            Object.hasOwn(promptData?.table, "data") &&
            !Array.isArray(promptData?.table?.data[0])
          ) {
            toast.error(
              "Please review and modify the prompt with more specifics.",
              {
                position: "top-right",
              },
            )
          } else {
            setCXOBoardsState((prev) => ({
              ...prev,
              executedPrompt: {
                ...promptData,
                table: promptData.table ?? null,
                charts: promptData.charts ?? [],
                message: promptData.message ?? [],
              },
            }))
          }
        })
        .catch((err) => {
          const errRes = err?.response?.data || "Something went wrong"
          toast.error(
            (Object.hasOwn(errRes, "detail") &&
              Object.hasOwn(errRes.detail, "message") &&
              Array.isArray(errRes.detail.message) &&
              errRes.detail.message.length &&
              errRes.detail.message[0]) ??
              "Something went wrong",
            { position: "top-right" },
          )
        })
    }
  }

  // #region Speech Recognition
  const promptText = form.watch("promptText")
  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition()

  const [hideMicrophone, setHideMicrophone] = useState(false)
  const isManualInput = useRef(false)
  const [isMicManuallyStarted, setIsMicManuallyStarted] = useState(false)

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser is not supported for speech recognition")
      return undefined
    }

    if (!listening && !!transcript) {
      form.setValue("promptText", transcript)
    }
    let timeout: undefined | ReturnType<typeof setTimeout>

    if (isMicManuallyStarted && !listening && !transcript) {
      setTimeout(() => {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } bg-gray-200 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <p className="text-sm font-medium text-gray-900 p-4">
              Didn't catch that. Try speaking again
            </p>
          </div>
        ))
      }, 5000)
    }

    return () => {
      if (!listening && !transcript) {
        clearTimeout(timeout)
      }
    }
  }, [transcript, listening, browserSupportsSpeechRecognition])

  useEffect(() => {
    if (listening) {
      isManualInput.current = false
    }
  }, [listening])

  useEffect(() => {
    if (isManualInput.current) {
      setHideMicrophone(promptText.trim().length > 0)
    } else if (!listening) {
      setHideMicrophone(false)
    }
  }, [promptText, listening])

  const handleManualInput = (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue("promptText", e.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    })
    isManualInput.current = true
  }
  // #endregion

  return (
    <div
      className={cn(
        "flex w-full items-center px-4 py-5 sm:p-4 lg:p-8",
        !boardId && "bg-[#3B1951]",
      )}
    >
      <Form {...form}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
          }}
          className={cn(
            "flex w-full items-center justify-between gap-4",
            boardId && "rounded-lg bg-[#313b96] p-5",
          )}
        >
          <InputField
            id="promptText"
            placeholder="Dynamic Prompt Entry"
            fieldName="promptText"
            control={form.control}
            labelClassName="font-medium"
            inputClassName="h-10 rounded-lg bg-white"
            containerClassName="w-full"
            onChange={handleManualInput}
          />

          <div className="flex items-center gap-2">
            {/* Speech Recognition Activation Button */}
            {!hideMicrophone && (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  setIsMicManuallyStarted(true)
                  SpeechRecognition.startListening({
                    language: "en-IN",
                  })
                }}
                readOnly={listening}
                className={clsx(
                  listening &&
                    "animate-pulse pointer-events-none duration-1000",
                )}
                disableAnimation={listening}
              >
                <FaMicrophone />
              </Button>
            )}
            <Button
              onClick={(event) => {
                event.preventDefault()
                form.handleSubmit(onRePrompt)()
              }}
              className="float-end border-[#F15A29]/30 bg-[#F15A29]/50 text-white"
              disabled={listening}
            >
              <Translate>Re Prompt</Translate>
            </Button>
            <Button
              onClick={(event) => {
                event.preventDefault()
                form.handleSubmit(onSubmit)()
              }}
              className="float-end border-[#F15A29]/30 bg-[#F15A29]/50 text-white"
              disabled={listening}
            >
              <FaPlay size={20} className="flex-shrink-0" />
            </Button>
            <Button
              disabled={listening}
              onClick={(event) => {
                event.preventDefault()
                form.handleSubmit((data) => {
                  createPrompt({
                    prompt_text: data.promptText,
                    board_id: Number(boardId),
                    user_name: user?.userName ?? "",
                  }).then(() => {
                    if (boardType !== "USE_CASES") {
                      get(
                        boardType === "FORECAST"
                          ? `/main-boards/boards/forecast-chat-response/board/${boardId}`
                          : `/main-boards/boards/prompts/${mainBoardId}/${boardId}/prompts`,
                      )
                        .then((res) => {
                          const response = res.data
                          setCXOBoardsState((prevState) => ({
                            ...prevState,
                            prompts: response,
                          }))
                        })
                        .catch(() =>
                          setCXOBoardsState((prevState) => ({
                            ...prevState,
                            prompts: [],
                          })),
                        )
                    }
                  })
                })()
              }}
              className={clsx(
                "float-end border-[#F15A29]/30 bg-[#F15A29]/50 text-white",
                (!form.getValues("promptText") ||
                  selectedPrompt === form.getValues("promptText")) &&
                  "pointer-events-none bg-[#F15A29]/30",
              )}
            >
              <Translate>Save</Translate>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
