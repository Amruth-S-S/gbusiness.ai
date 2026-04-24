import { Translate } from "gbusiness-ai-react-auto-translate"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type AlertModalProps = {
  isOpen: boolean
  title: string
  description: string
  cancelBtnLabel?: string
  actionBtnLabel?: string
  onCancelClick?: () => void
  onActionClick?: () => void
}

export function AlertModal({
  isOpen,
  title,
  description,
  cancelBtnLabel = "Cancel",
  actionBtnLabel = "Delete",
  onCancelClick,
  onActionClick,
}: AlertModalProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Translate>{title}</Translate>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Translate>{description}</Translate>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancelClick ?? undefined}>
            <Translate>{cancelBtnLabel}</Translate>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onActionClick ?? undefined}>
            <Translate>{actionBtnLabel}</Translate>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
