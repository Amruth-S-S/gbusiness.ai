import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MdSend } from "react-icons/md"
import axios from "axios"
import toast from "react-hot-toast"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { IoReloadOutline } from "react-icons/io5"
import clsx from "clsx"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import { FaMicrophone } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { InputField } from "@/components/molecules/fields/InputField"
import { digitalOceanBaseUrl } from "@/lib/constants"
import { getOrCreateSessionId } from "@/lib/session"
import { fetchChatData } from "@/hooks/use-chat"
import { useChatStore } from "@/store/chat"
import LoadingIcon from "@/components/atoms/LoadingIcon"
import { Download } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

type ChatFormView = {
  boardId: number
  disabledDownloadBtn?: boolean
  onDownloadClick?: () => void
}

export function ChatForm({
  boardId,
  disabledDownloadBtn,
  onDownloadClick,
}: ChatFormView) {
  const { user } = useAuth()
  const { updateChatStore } = useChatStore()
  const [isLoading, setIsLoading] = useState(false)

  const [hideMicrophone, setHideMicrophone] = useState(false)

  const chatFormSchema = z.object({
    chatMessage: z.string().min(1, { message: "Message is required" }),
  })
  const sessionId = getOrCreateSessionId()

  type ChatFormValues = z.infer<typeof chatFormSchema>

  const defaultValues: Partial<ChatFormValues> = {
    chatMessage: "",
  }

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues,
  })

  const { isDirty, isValid } = form.formState

  const chatMessage = form.watch("chatMessage")

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition()

  const isManualInput = useRef(false)

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Your browser is not supported for speech recognition")
      return
    }

    if (!listening && transcript.trim() !== "") {
      form.setValue("chatMessage", transcript)
      SpeechRecognition.stopListening()
      setHideMicrophone(true)
    }
  }, [transcript, listening, browserSupportsSpeechRecognition, form])

  const handleManualInput = (e: ChangeEvent<HTMLInputElement>) => {
    form.setValue("chatMessage", e.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    })
    isManualInput.current = true
  }

  useEffect(() => {
    if (listening) {
      setHideMicrophone(false)
    } else if (isManualInput.current) {
      setHideMicrophone(chatMessage.trim().length > 0)
    } else {
      setHideMicrophone(false)
    }
  }, [chatMessage, listening])

  function onSubmit(formData: ChatFormValues) {
    setIsLoading(true)

    if (listening) {
      SpeechRecognition.stopListening()
    }

    if (boardId) {
      const payload = {
        collection_id: boardId,
        message: formData.chatMessage,
        sessionId,
      }

      const userId = user?.userId

      axios
        .post(`${digitalOceanBaseUrl}/chat?user_id=${userId}`, payload, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        .then(() => {
          fetchChatData(updateChatStore, boardId)
          form.reset({ chatMessage: "" })
          isManualInput.current = false
          setHideMicrophone(false)
        })
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false))
    }
  }

  useEffect(() => {
    if (chatMessage.trim() === "") {
      isManualInput.current = false
      setHideMicrophone(false)
    }
  }, [chatMessage])

  return (
    <div className="mb-5 mt-2 flex items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 w-full items-center"
        >
          <InputField
            id="chatMessage"
            placeholder="Type your message..."
            fieldName="chatMessage"
            control={form.control}
            labelClassName="font-medium"
            containerClassName="w-full"
            readOnly={isLoading}
            onChange={handleManualInput}
          />

          {!hideMicrophone && (
            <Button
              onClick={(e) => {
                e.preventDefault()
                SpeechRecognition.startListening({
                  language: "en-IN",
                  continuous: false,
                })
              }}
              disabled={listening}
              className={clsx(
                listening && "animate-pulse pointer-events-none duration-1000",
              )}
            >
              <FaMicrophone />
            </Button>
          )}

          <Button
            type="submit"
            size="icon"
            disabled={!isDirty || !isValid || isLoading || listening}
            className={clsx(
              (!isDirty || !isValid || isLoading) &&
                "bg-gray-400 cursor-auto pointer-events-none",
              "flex-shrink-0",
            )}
          >
            {isLoading ? (
              <LoadingIcon icon={<IoReloadOutline />} />
            ) : (
              <>
                <MdSend className="min-w-[16px] min-h-[16px]" />
                <span className="sr-only">Send</span>
              </>
            )}
          </Button>

          {!!onDownloadClick && (
            <Button
              type="button"
              readOnly={disabledDownloadBtn}
              onClick={onDownloadClick}
              disabled={listening}
              className={clsx(
                listening && "animate-pulse pointer-events-none duration-1000",
              )}
            >
              <Download />
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
