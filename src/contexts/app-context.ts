import { createContext, useContext } from "react"
import { RUseApp } from "@/hooks/use-app"

export interface RAppContext extends RUseApp {}

export const AppContext = createContext<RUseApp | undefined>(undefined)

type UseAppContext = () => RAppContext

export const useAppContext: UseAppContext = () => {
  const appContext = useContext(AppContext)

  if (!appContext) {
    throw new Error("app context is undefined")
  }

  return appContext
}
