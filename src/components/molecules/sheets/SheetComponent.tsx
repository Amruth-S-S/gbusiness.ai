import { ReactNode } from "react"
import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type SheetComponentProps = {
  isOpen: boolean
  setIsOpen?: () => void
  sheetTrigger?: ReactNode
  sheetTitle?: string
  sheetTitleClassName?: string
  sheetDescription?: string
  sheetDescriptionClassName?: string
  sheetContent: ReactNode
  sheetFooter?: ReactNode
}

export function SheetComponent({
  isOpen,
  setIsOpen,
  sheetTrigger,
  sheetTitle,
  sheetTitleClassName,
  sheetDescription,
  sheetDescriptionClassName,
  sheetContent,
  sheetFooter,
}: SheetComponentProps) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{sheetTrigger}</SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle
            className={sheetTitleClassName}
            aria-describedby={undefined}
          >
            <Translate>{sheetTitle ?? ""}</Translate>
          </SheetTitle>

          <SheetDescription
            className={sheetDescriptionClassName}
            aria-describedby={undefined}
          >
            <Translate>{sheetDescription ?? ""}</Translate>
          </SheetDescription>
        </SheetHeader>
        {sheetContent}
        {!!sheetFooter && (
          <SheetFooter>
            <SheetClose asChild>{sheetFooter}</SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
