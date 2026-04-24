"use client"

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react"
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

type ConfirmDeleteOptions = {
  title?: string
  description?: string
  actionBtnLabel?: string
  cancelBtnLabel?: string
  onConfirm: () => void
  onCancel?: () => void
}

type DeleteDialogContextType = {
  confirmDelete: (options: ConfirmDeleteOptions) => {
    close: () => void
    setLoading: (value: boolean) => void
  }
}

const DeleteDialogContext = createContext<DeleteDialogContextType | undefined>(
  undefined,
)

export const useDeleteDialog = () => {
  const context = useContext(DeleteDialogContext)
  if (!context)
    throw new Error("useDeleteDialog must be used within DeleteDialogProvider")
  return context
}

export const DeleteDialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmDeleteOptions | null>(null)
  const [isLoading, setIsLoading] = useState(false) // new state

  const confirmDelete = useCallback((opts: ConfirmDeleteOptions) => {
    setOptions(opts)
    setIsOpen(true)

    const close = () => {
      setIsOpen(false)
      setIsLoading(false)
    }

    return {
      close,
      setLoading: setIsLoading,
    }
  }, [])

  const contextValue = useMemo(() => ({ confirmDelete }), [confirmDelete])

  const onActionClick = () => {
    options?.onConfirm?.()
  }

  const onCancelClick = () => {
    options?.onCancel?.()
    setIsOpen(false)
  }

  return (
    <DeleteDialogContext.Provider value={contextValue}>
      {children}

      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          {options?.title && (
            <AlertDialogHeader>
              <AlertDialogTitle>
                <Translate>{options.title}</Translate>
              </AlertDialogTitle>
            </AlertDialogHeader>
          )}
          {options?.description && (
            <AlertDialogDescription>
              <Translate>{options.description}</Translate>
            </AlertDialogDescription>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isLoading}
              onClick={onCancelClick ?? undefined}
            >
              <Translate>{options?.cancelBtnLabel ?? "Cancel"}</Translate>
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isLoading}
              onClick={onActionClick ?? undefined}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-transparent rounded-full" />
                  <Translate>Deleting...</Translate>
                </div>
              ) : (
                <Translate>{options?.actionBtnLabel ?? "Delete"}</Translate>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DeleteDialogContext.Provider>
  )
}
