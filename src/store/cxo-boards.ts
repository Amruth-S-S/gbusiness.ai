import { create } from "zustand"
import { BreadcrumbItemProps } from "@/components/atoms/controls/BreadCrumbComponent"

interface CXOBoardsState {
  isLoading: boolean
  error: string | null
  breadCrumbItems: BreadcrumbItemProps[]
}

export type UpdateCXOBoardsStore = (state: Partial<CXOBoardsState>) => void

interface CXOBoardsStoreActions {
  updateCXOBoardsStore: UpdateCXOBoardsStore
}

type CXOBoardsStore = CXOBoardsState & CXOBoardsStoreActions

const initialState: CXOBoardsState = {
  isLoading: true,
  error: null,
  breadCrumbItems: [],
}

export const useCXOBoardsStore = create<CXOBoardsStore>((set) => ({
  ...initialState,
  updateCXOBoardsStore: (state: Partial<CXOBoardsState>) => {
    set(state, false)
  },
}))
