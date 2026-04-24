import { useState } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import { Heading, Paragraph } from "@/components/atoms/texts"
import { SheetComponent } from "@/components/molecules/sheets/SheetComponent"
import { Button } from "@/components/ui/button"

type MetaInfoRightPanelProps = {
  metaInfo: Record<string, string>
}

export function MetaInfoRightPanel({ metaInfo }: MetaInfoRightPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <SheetComponent
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        sheetContent={
          <div className="max-h-[calc(100vh_-_50px)] space-y-4 overflow-y-auto pt-4">
            {Object.entries(metaInfo)?.map(([key, value]) => (
              <div className="" key={key}>
                <Heading text={key} type="h4" className="text-lg" />
                <Paragraph text={value} className="pl-6 text-sm" />
              </div>
            ))}
          </div>
        }
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
