import { create } from "zustand"

interface LanguagesState {
  selectedLang: string
}

export type UpdateLanguagesStore = (state: Partial<LanguagesState>) => void

interface LanguagesStoreActions {
  updateLanguagesStore: UpdateLanguagesStore
}

type LanguagesStore = LanguagesState & LanguagesStoreActions

const initialState: LanguagesState = {
  selectedLang: "en",
}

export const useLanguagesStore = create<LanguagesStore>((set) => ({
  ...initialState,
  updateLanguagesStore: (state: Partial<LanguagesState>) => {
    set(state)
  },
}))
