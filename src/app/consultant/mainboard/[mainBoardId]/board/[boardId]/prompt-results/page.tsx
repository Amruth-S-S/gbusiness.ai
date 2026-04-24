"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { DynamicPromptsResultView } from "@/components/organisms/views/prompts-result-view/DynamicPromptsResultsView"
import { Button } from "@/components/ui/button"
import { usePromptsStore } from "@/store/prompts"
import { Heading } from "@/components/atoms/texts"

export default function ConsultantPromptResults() {
  const { executedPrompt, promptNumber } = usePromptsStore()
  const router = useRouter()

  return (
    <div className="p-4">
      <div className="flex flex-col items-start gap-2">
        <Button
          onClick={(e) => {
            e.preventDefault()
            router.back()
          }}
          className="p-2 pr-3 h-auto"
        >
          <ChevronLeft /> Back
        </Button>
        <Heading
          type="h1"
          text={`${promptNumber}. ${executedPrompt.prompt_text}`}
          className="text-2xl font-semibold flex-1"
        />
      </div>
      <DynamicPromptsResultView
        {...executedPrompt}
        tabClassName="max-h-[calc(100vh-100px)] h-full overflow-y-auto"
      />
    </div>
  )
}
