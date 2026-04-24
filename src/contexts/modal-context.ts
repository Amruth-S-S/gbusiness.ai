import { createContext, useContext } from "react"
import { RUseModal } from "@/hooks/use-modal"

export interface RModalContext extends RUseModal {}

export const ModalContext = createContext<RUseModal | undefined>(undefined)

type UseModalContext = () => RModalContext

export const useModalContext: UseModalContext = () => {
  const modalContext = useContext(ModalContext)

  if (!modalContext) {
    throw new Error("modal context is undefined")
  }

  return modalContext
}
