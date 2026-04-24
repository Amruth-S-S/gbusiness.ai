import { create } from "zustand"
import type { User } from "@/lib/types"

interface UserState {
  isLoading: boolean
  data: User | null
  error: string | null
}

export type UpdateUserStore = (state: Partial<UserState>) => void

interface UserStoreActions {
  updateUserStore: UpdateUserStore
}

type UserStore = UserState & UserStoreActions

const initialState: UserState = {
  isLoading: true,
  data: null,
  error: null,
}

export const useUserStore = create<UserStore>((set) => ({
  ...initialState,
  updateUserStore: (state: Partial<UserState>) => {
    set(state, false)
  },
}))
