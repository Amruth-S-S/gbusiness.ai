import { create } from "zustand"
import { Collection } from "@/lib/types"

interface CollectionsState {
  isLoading: boolean
  error: string | null
  data: Collection[]
}

export type UpdateCollectionsStore = (state: Partial<CollectionsState>) => void

interface CollectionsStoreActions {
  updateCollectionsStore: UpdateCollectionsStore
}

export type CollectionsStore = CollectionsState & CollectionsStoreActions

const initialState: CollectionsState = {
  isLoading: true,
  error: null,
  data: [],
}

export const useCollectionsStore = create<CollectionsStore>((set) => ({
  ...initialState,
  updateCollectionsStore: (state: Partial<CollectionsState>) => {
    set(state, false)
  },
}))
