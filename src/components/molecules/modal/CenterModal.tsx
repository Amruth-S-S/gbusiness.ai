import { ReactNode } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useModalContext } from "@/contexts/modal-context"
import { closeModal } from "@/hooks/use-modal"
import { useScrollLock } from "@/hooks/use-scroll-lock"

type CenterModalProps = {
  children: ReactNode
  contentClassName?: string
  closeOnOverlayClick?: boolean
  backBtnClick?: () => void
  onCloseModal?: () => void
  dialogChildrenWrapperClassName?: string
}

export function CenterModal({
  children,
  contentClassName,
  closeOnOverlayClick,
  onCloseModal,
  backBtnClick,
  dialogChildrenWrapperClassName,
}: CenterModalProps) {
  const { unlockScroll } = useScrollLock()
  const {
    modalState: { isOpen, heading, headingClassName },
    setModalState,
  } = useModalContext()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onCloseModal?.()
        closeModal(setModalState, unlockScroll)
      }}
    >
      <DialogContent
        className={cn(contentClassName, "sm:max-w-md")}
        onPointerDownOutside={(e) => {
          if (!closeOnOverlayClick) {
            e.preventDefault()
          }
        }}
        heading={heading}
        headingClassName={headingClassName}
        backBtnClick={backBtnClick}
        childrenWrapperClassName={dialogChildrenWrapperClassName}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}
