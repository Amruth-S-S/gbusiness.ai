/* eslint-disable react/no-array-index-key */
import { Translate } from "gbusiness-ai-react-auto-translate"
import { useState } from "react"
import { Heading, Paragraph } from "@/components/atoms/texts"
import { SheetComponent } from "@/components/molecules/sheets/SheetComponent"
import { Metadata } from "@/components/organisms/forms/rag-prompt-form/RagPromptForm"
import { Button } from "@/components/ui/button"

type MetaDataViewProps = {
  metaData: Metadata[]
}

export function MetaDataView({ metaData }: MetaDataViewProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <SheetComponent
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        sheetContent={metaData.map((data, index) => (
          <div key={index} className="border-b border-black py-2">
            {Object.entries(data).map(([key, value], subIndex) => (
              <div key={subIndex} className="flex gap-1">
                <Heading text={`${key}:`} className="text-base font-semibold" />
                <Paragraph
                  text={
                    typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)
                  }
                  className="break-all text-sm"
                />
              </div>
            ))}
          </div>
        ))}
      />
      <Button
        className="fixed right-2 top-[50%] bg-primary text-white"
        onClick={() => setIsOpen(true)}
      >
        <Translate>View Meta Information</Translate>
      </Button>
    </div>
  )
}
