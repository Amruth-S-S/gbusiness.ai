import { type Dispatch, useEffect, useState } from "react"
import { type User } from "@/lib/types"

interface AppState {
  userInfo: User | null
  showLoader: boolean
}

type DispatchAppState = Dispatch<AppState | ((prevState: AppState) => AppState)>

export type RUseApp = {
  appState: AppState
  setAppState: DispatchAppState
}

type UseApp = () => RUseApp

export const useApp: UseApp = () => {
  const [appState, setAppState] = useState<AppState>({
    userInfo: null,
    showLoader: false,
  })

  useEffect(() => {
    async function fetchUserInfo() {
      const userInfo = await window.localStorage.getItem("userInfo")
      if (userInfo) {
        const {
          accessToken,
          userId,
          role,
          userName,
          email,
          subscription,
          customerOtherDetails,
        } = JSON.parse(userInfo)
        setAppState((prev) => ({
          ...prev,
          userInfo: {
            accessToken,
            userId,
            role,
            userName,
            email,
            subscription,
            customerOtherDetails,
          },
        }))
      }
    }

    fetchUserInfo()
  }, [])

  return { appState, setAppState }
}
