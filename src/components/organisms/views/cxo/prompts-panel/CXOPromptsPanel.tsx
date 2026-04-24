import { useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { SheetComponent } from "@/components/molecules/sheets/SheetComponent"
import { Button } from "@/components/ui/button"
import { useCXOBoardsContext } from "@/contexts/cxo-boards-context"

export function CXOPromptsPanel() {
  const {
    cxoBoardsState: { prompts },
    setCXOBoardsState,
  } = useCXOBoardsContext()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <SheetComponent
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        sheetTitle="Prompts"
        sheetContent={
          <div className="max-h-[calc(100vh_-_50px)] space-y-4 overflow-y-auto pt-4">
            {prompts?.map((prompt, index) => (
              <Button
                key={prompt.id}
                variant="destructive"
                disableAnimation
                onClick={() => {
                  setCXOBoardsState((prevState) => ({
                    ...prevState,
                    selectedPrompt: prompt.prompt_text || prompt.input_text,
                  }))
                  setIsOpen(false)
                }}
                className="h-fit w-full cursor-pointer whitespace-normal rounded-md bg-gray-200 p-2 text-base hover:bg-gray-200 hover:shadow-sm hover:shadow-primary"
              >
                <Translate>{`${index + 1}. ${prompt.prompt_text || prompt.input_text}`}</Translate>
              </Button>
            ))}
          </div>
        }
      />
      <Button
        className="fixed right-2 top-[50%] bg-primary text-white"
        onClick={() => setIsOpen(true)}
      >
        <Translate>View Prompts</Translate>
      </Button>
    </>
  )
}
