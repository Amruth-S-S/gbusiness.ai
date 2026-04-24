/* eslint-disable react/no-unescaped-entities */
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import toast from "react-hot-toast"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition"
import clsx from "clsx"
import { FaMicrophone } from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { CustomTextArea } from "@/components/molecules/fields/CustomTextArea"
import { post } from "@/services/utils"
import { ragBaseUrl } from "@/lib/constants"
import { Heading, Paragraph } from "@/components/atoms/texts"
import { MetaDataView } from "../../views/consultant/rag/MetaDataView"

export type Metadata = {
  text_id: string
  text: string
  category: string
  languages: string[]
  filetype: string
  last_modified: string
  coordinates: [number, number][]
  page_number: number
}

type Result = {
  final_answer: string
  metadata: Metadata[]
}

export function RagPromptForm() {
  const [results, setResults] = useState<Result | null>(null)

  const ragQueryFormSchema = z.object({
    query: z.string({ required_error: "" }),
  })

  type RagQueryFormValues = z.infer<typeof ragQueryFormSchema>

  const defaultValues: Partial<RagQueryFormValues> = {
    query: "",
  }

  const form = useForm<RagQueryFormValues>({
    resolver: zodResolver(ragQueryFormSchema),
    defaultValues,
  })

  async function onRun(data: RagQueryFormValues) {
    setResults(null)
    if (data.query) {
      const url = new URL(`/documents/search/`, ragBaseUrl)
      const payload = {
        query: data.query,
        collection_name: "text_info",
      }

      post(url.href, payload)
        .then((response) => {
          setResults(response.data)
        })
        .catch(() => {
          toast.error(
            "Please review and modify the prompt with more specifics.",
          )
          setResults(null)
        })
    }
  }

  // #region Speech Recognition
  const promptText = form.watch("query")
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
      form.setValue("query", transcript)
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
    form.setValue("query", e.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    })
    isManualInput.current = true
  }
  // #endregion

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form className="mb-5 w-full">
          <CustomTextArea
            id="query"
            placeholder="Enter your query..."
            fieldName="query"
            control={form.control}
            labelClassName="font-medium"
            onChange={handleManualInput}
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
              name="run"
              onClick={(event) => {
                event.preventDefault()
                form.handleSubmit(onRun)()
              }}
            >
              <Translate>Get Results</Translate>
            </Button>
          </div>
        </form>
      </Form>
      {!!results && (
        <div className="bg-gray-50 max-w-[60vw] p-3 pl-4 rounded-2xl">
          <Heading text="Results:" className="text-lg font-semibold mb-1" />
          <Paragraph text={results.final_answer} />
          <MetaDataView metaData={results.metadata} />
        </div>
      )}
    </div>
  )
}
