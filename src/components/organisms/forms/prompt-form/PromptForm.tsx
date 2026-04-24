/* eslint-disable camelcase */
/* eslint-disable react/no-unescaped-entities */
import { CustomTextArea } from "@/components/molecules/fields/CustomTextArea"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useAuth } from "@/contexts/auth-context"
import { useModalContext } from "@/contexts/modal-context"
import { closeModal, openModal } from "@/hooks/use-modal"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { baseUrl } from "@/lib/constants"
import { SettingsViewProps } from "@/lib/props"
import { createPrompt, editPrompt } from "@/services"
import { post, put } from "@/services/utils"
import { useBoardsStore } from "@/store/boards"
import { SelectedPromptInfo, usePromptsStore } from "@/store/prompts"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { FaMicrophone } from "react-icons/fa6"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import * as z from "zod"
import { DynamicPromptsResultView } from "../../views/prompts-result-view/DynamicPromptsResultsView"

export function PromptForm() {
  const { user } = useAuth()
  const { executedPrompt, updatePromptsState, fetchPrompts } = usePromptsStore()
  const { selectedBoard } = useBoardsStore()
  const boardId = selectedBoard?.id ?? null

  const { charts, table, message, prompt_text } = executedPrompt
  const { modalState, setModalState } = useModalContext()
  const {
    selectedPromptInfo,
    apiKey,
    secondaryApiKey,
    firstLevelFilter,
    forecastPeriod,
    forecastResponseId,
    secondLevelFilter,
    isCardReadOnly,
  } = modalState.data as {
    isCardReadOnly?: boolean
    forecastPeriod?: number
    forecastResponseId?: number
    firstLevelFilter?: string
    secondLevelFilter?: string
    selectedPromptInfo: SelectedPromptInfo
  } & Pick<SettingsViewProps["info"], "apiKey" | "secondaryApiKey">
  const { lockScroll, unlockScroll } = useScrollLock()
  const [showResults, setShowResults] = useState(false)

  const promptFormSchema = z.object({
    promptText: z.string({ required_error: "" }),
  })

  type PromptFormValues = z.infer<typeof promptFormSchema>

  const defaultValues: Partial<PromptFormValues> = {
    promptText: selectedPromptInfo?.promptText ?? "",
  }

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptFormSchema),
    defaultValues,
  })

  async function onRePrompt(data: PromptFormValues) {
    if (boardId) {
      const url = new URL("main-boards/boards/prompts/re_prompt", baseUrl)
      url.searchParams.append("input_text", data.promptText)
      url.searchParams.append("board_id", boardId.toString())
      post(url.href)
        .then((res) => {
          const promptText = res && res.data
          if (promptText) {
            form.setValue("promptText", promptText)
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

  async function onSubmit(data: PromptFormValues) {
    setShowResults(false)
    if (boardId && user?.userName) {
      if (selectedPromptInfo?.promptId) {
        if (forecastResponseId) {
          const payload = {
            board_id: boardId,
            first_level_filter: firstLevelFilter,
            forecast_period: forecastPeriod,
            forecast_response_id: forecastResponseId,
            input_text: data.promptText,
            second_level_filter: secondLevelFilter,
          }
          put(
            `/main-boards/boards/forecast-chat-response/id/${selectedPromptInfo.promptId}`,
            payload,
          ).then(() => {
            openModal(setModalState, lockScroll, {
              modalState: {
                contentName: modalState.prevContentName,
                data: modalState.prevData,
                isActive: true,
                isOpen: true,
                heading: modalState.prevHeading,
              },
            })
          })
        } else {
          const { data: promptData, errRes } = await editPrompt(
            selectedPromptInfo.promptId,
            {
              prompt_text: data.promptText,
              board_id: boardId,
              user_name: user.userName,
            },
          )
          if (promptData) {
            fetchPrompts(apiKey, boardId)
            closeModal(setModalState, unlockScroll)
          }
          if (errRes) {
            toast.error("Something went wrong", { position: "top-right" })
          }
        }
      } else {
        createPrompt({
          prompt_text: data.promptText,
          board_id: boardId,
          user_name: user.userName,
        }).then(() => {
          fetchPrompts(apiKey, boardId)
          closeModal(setModalState, unlockScroll)
        })
      }
    }
  }

  async function onRun(data: PromptFormValues) {
    if (data.promptText && boardId && secondaryApiKey) {
      const url = new URL(`/main-boards/boards/${secondaryApiKey}`, baseUrl)
      url.searchParams.append("input_text", data.promptText)
      url.searchParams.append("board_id", boardId.toString())
      url.searchParams.append("use_cache", "true")
      if (firstLevelFilter && forecastPeriod && forecastResponseId) {
        url.searchParams.append(
          "forecast_response_id",
          forecastResponseId.toString(),
        )
        url.searchParams.append("first_level_filter", firstLevelFilter)
        url.searchParams.append("forecast_period", forecastPeriod.toString())
      }
      if (secondLevelFilter) {
        url.searchParams.append("second_level_filter", secondLevelFilter)
      }
      post(url.href)
        .then((response) => {
          if (Array.isArray(response.data.message)) {
            updatePromptsState({
              executedPrompt: response.data,
            })
            setShowResults(true)
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
            })
            setShowResults(false)
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
          })
          setShowResults(false)
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

  const handleManualInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue("promptText", e.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    })
    isManualInput.current = true
  }
  // #endregion

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <Form {...form}>
        <form className="mb-5 w-full">
          <CustomTextArea
            id="promptText"
            label="Prompt Text"
            placeholder="Prompt Text"
            fieldName="promptText"
            control={form.control}
            labelClassName="font-medium"
            rows={2}
            onChange={handleManualInput}
            maxHeight={400}
          />

          <div className="float-end mt-4 flex gap-2">
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
              disabled={listening}
              type="submit"
              name="rerun"
              onClick={(event) => {
                event.preventDefault()
                form.handleSubmit(onRePrompt)()
              }}
            >
              <Translate>Re Prompt</Translate>
            </Button>
            <Button
              disabled={listening}
              type="submit"
              name="run"
              onClick={(event) => {
                event.preventDefault()
                form.handleSubmit(onRun)()
              }}
            >
              <Translate>Run</Translate>
            </Button>
            {((!isCardReadOnly && !forecastResponseId) ||
              (selectedPromptInfo?.promptId && forecastResponseId)) && (
              <Button
                disabled={listening}
                type="submit"
                name="save"
                onClick={(event) => {
                  event.preventDefault()
                  form.handleSubmit(onSubmit)()
                }}
              >
                <Translate>Save</Translate>
              </Button>
            )}
          </div>
        </form>
      </Form>
      {showResults && (
        <DynamicPromptsResultView
          charts={charts}
          table={table}
          message={message}
          promptText={prompt_text}
          tabsListClassName="float-end"
          tabClassName="w-full"
        />
      )}
    </div>
  )
}
