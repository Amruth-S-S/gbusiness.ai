import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useModalContext } from "@/contexts/modal-context"

export type Callback = () => void

type UseScrollLock = () => { lockScroll: Callback; unlockScroll: Callback }

export const useScrollLock: UseScrollLock = () => {
  const pathname = usePathname()
  const [previousPathName, setPreviousPathName] = useState(pathname)
  const { setModalState } = useModalContext()

  const lockScroll = () => {
    document.body.style.overflow = "hidden"
    document.body.style.pointerEvents = "none"
  }

  const unlockScroll = () => {
    document.body.style.overflow = ""
    document.body.style.pointerEvents = "all"
  }

  useEffect(() => {
    const handleRouteChange = () => {
      setModalState((prevState) => ({
        ...prevState,
        isActive: false,
        canDeactivate: false,
        type: null,
        contentName: null,
      }))
      unlockScroll()
    }
    if (pathname !== previousPathName) {
      handleRouteChange()
    }
    setPreviousPathName(pathname)
  }, [pathname])

  return { lockScroll, unlockScroll }
}
