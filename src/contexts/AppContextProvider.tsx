"use client"

import { ReactNode, useMemo } from "react"
import { AppContext } from "@/contexts/app-context"
import { RUseApp, useApp } from "@/hooks/use-app"
import { RUseModal, useModal } from "@/hooks/use-modal"
import { ModalContext } from "./modal-context"

type AppContextProviderProps = {
  children: ReactNode
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const { appState, setAppState } = useApp()
  const { modalState, setModalState } = useModal()

  const appMemoState = useMemo<RUseApp>(
    () => ({ appState, setAppState }),
    [appState, setAppState],
  )

  const modalMemoState = useMemo<RUseModal>(
    () => ({ modalState, setModalState }),
    [modalState, setModalState],
  )

  return (
    <AppContext.Provider value={appMemoState}>
      <ModalContext.Provider value={modalMemoState}>
        {children}
      </ModalContext.Provider>
    </AppContext.Provider>
  )
}
