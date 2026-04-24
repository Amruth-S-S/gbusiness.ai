import { Dispatch, useState } from "react"
import { Callback } from "./use-scroll-lock"

export type ContentName =
  | "FORM__BOARD"
  | "FORM__PROMPT"
  | "FORM__ANALYSIS_DMT"
  | "FORM__FORECAST"
  | "FORM__PROMPT_ENTRY"
  | "VIEW__TROUBLESHOOT"
  | "VIEW__PROMPTS_RESULT"
  | "VIEW__PROMPT_FILE_UPLOAD"
  | "VIEW__ANALYSIS_DMT_FILE_UPLOAD"
  | "VIEW__CONSULTANT_PROMPTS_VIEW"
  | "VIEW__RAG_FILE_UPLOAD"
  | "VIEW__SETTINGS"

interface ModalState {
  isActive: boolean
  isOpen: boolean
  heading?: string
  headingClassName?: string
  contentName: null | ContentName
  prevContentName: null | ContentName
  data?: null | unknown
  isOperationComplete: boolean
  prevHeading?: string
  prevData?: null | unknown
}

type DispatchModalState = Dispatch<
  ModalState | ((prevState: ModalState) => ModalState)
>

export type RUseModal = {
  modalState: ModalState
  setModalState: DispatchModalState
}

type UseModal = () => RUseModal

export const useModal: UseModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isActive: false,
    isOpen: false,
    contentName: null,
    prevContentName: null,
    isOperationComplete: false,
  })

  return { modalState, setModalState }
}

type OpenModalOptions = {
  modalState?: Partial<ModalState>
}

type OpenModal = (
  setModalState: DispatchModalState,
  lockScroll: Callback,
  options: OpenModalOptions,
) => void

export const openModal: OpenModal = (setState, lockScroll, options) => {
  const { modalState } = options

  lockScroll()

  setState((prev) => ({
    ...modalState,
    isActive: true,
    isOpen: true,
    contentName: modalState?.contentName ?? null,
    prevContentName: prev.contentName,
    isOperationComplete: false,
    prevHeading: prev.heading,
    prevData: prev.data,
  }))
}

type CloseModal = (
  setModalState: DispatchModalState,
  unlockScroll: Callback,
  isOperationComplete?: boolean,
) => void

export const closeModal: CloseModal = (
  setState,
  unlockScroll,
  isOperationComplete,
) => {
  setState((prevState) => ({
    ...prevState,
    isOpen: false,
    isActive: false,
    canDeactivate: true,
    isOperationComplete: !!isOperationComplete,
  }))

  setTimeout(() => {
    setState((prevState) => ({
      ...prevState,
      contentName: null,
      prevContentName: prevState.contentName,
      prevHeading: prevState.heading,
      prevData: prevState.data,
      heading: undefined,
    }))
    unlockScroll()

    requestAnimationFrame(() => {
      document.body.style.pointerEvents = "auto"
    })
  }, 300)
}

type ShouldDeactivate = (
  contentName: null | ContentName,
  allowExceptions: ContentName[],
) => boolean

export const shouldDeactivate: ShouldDeactivate = (
  contentName,
  allowExceptions,
) => {
  const exceptions: ContentName[] = [...allowExceptions]

  return !!contentName && !exceptions.includes(contentName)
}
