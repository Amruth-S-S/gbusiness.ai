import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HiOutlinePlus, HiPlay } from "react-icons/hi2"
import { Prompt } from "@/services"
import { Paragraph } from "@/components/atoms/texts"
import { usePathname } from "next/navigation"
import { TitleSummary } from "@/components/molecules/summaries/TitleSummary"
import { cn } from "@/lib/utils"
import { useModalContext } from "@/contexts/modal-context"
import { MdDelete, MdEdit } from "react-icons/md"
import { CardComponent } from "@/components/atoms/controls/CardComponent"
import { Translate } from "gbusiness-ai-react-auto-translate"

type PromptsCardsProps = {
  prompts: Prompt[]
  onRun: (prompt: Prompt, promptNumber: number) => void
  onEdit: (prompt: Prompt) => void
  onDelete: (prompt: Prompt) => void
  onNewBtnClick: () => void
  isPromptManagementDisabled?: boolean
  isPromptSelected: boolean
  isLoading?: boolean
}

export function PromptsCards({
  prompts,
  onRun,
  onEdit,
  onDelete,
  isPromptManagementDisabled,
  onNewBtnClick,
  isPromptSelected,
  isLoading,
}: PromptsCardsProps) {
  const pathName = usePathname()
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

  if (isPromptSelected) return null

  return (
    <div className="flex flex-col gap-4 w-full">
      {!prompts?.length && !pathName.includes("cxo") && !isLoading && (
        <CardComponent
          className="h-[175px] w-full flex-col items-center justify-center rounded-[20px] p-0 shadow-sm sm:w-60"
          cardContentClassName="h-full py-0"
          cardContent={
            <Button
              variant="destructive"
              className="h-full w-full flex-col items-center justify-center p-0 text-base font-semibold text-primary"
              onClick={onNewBtnClick}
            >
              <Translate>New</Translate>
            </Button>
          }
        />
      )}

      {!isPromptManagementDisabled &&
        !modalDataInfo?.isCardReadOnly &&
        !isLoading && (
          <div className="flex justify-end items-center flex-wrap gap-2">
            <Button onClick={onNewBtnClick}>
              <HiOutlinePlus className="mr-1 h-4 w-4" /> New Prompt
            </Button>
          </div>
        )}

      {/* Prompt cards */}
      {prompts?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt, index) => (
            <Card
              key={`prompt-${prompt.id}`}
              className={cn(
                "flex h-full w-full flex-col justify-between rounded-2xl shadow-sm",
                (isPromptManagementDisabled || modalDataInfo?.isCardReadOnly) &&
                  "border-2 border-white cursor-pointer shadow-transparent hover:border-[#a7abae] hover:bg-[#ebecee] hover:shadow-lg",
              )}
              onClick={() => {
                if (
                  isPromptManagementDisabled ||
                  modalDataInfo?.isCardReadOnly
                ) {
                  onRun(prompt, index + 1)
                }
              }}
            >
              <CardHeader title={prompt.prompt_text || prompt.input_text}>
                <Paragraph
                  text={`${
                    !pathName.includes("cxo") ? `${index + 1}.` : ""
                  } ${prompt.prompt_text || prompt.input_text}`}
                  className="line-clamp-3 text-left text-base font-semibold leading-[26px] text-[#333333]"
                />
              </CardHeader>

              <CardContent className="pb-4">
                <TitleSummary
                  className="flex items-end gap-2 pt-1"
                  title="Updated at: "
                  titleClassName="text-left font-sans text-xs text-gray-600"
                  summary={new Date(prompt.updated_at).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                  summaryClassName="text-left font-sans text-sm text-gray-600 font-medium"
                />
              </CardContent>

              {!isPromptManagementDisabled &&
                !modalDataInfo?.isCardReadOnly && (
                  <CardFooter className="flex justify-center border-t border-gray-300">
                    <Button
                      variant="destructive"
                      onClick={() => onRun(prompt, index + 1)}
                    >
                      <HiPlay size={20} />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onEdit(prompt)}
                    >
                      <MdEdit size={20} />
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(prompt)}
                    >
                      <MdDelete size={20} />
                    </Button>
                  </CardFooter>
                )}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No prompts found.</p>
      )}
    </div>
  )
}
