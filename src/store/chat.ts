import { create } from "zustand"
import { Chat } from "@/lib/types"

interface ChatState {
  isLoading: boolean
  error: string | null
  data: Chat[]
}

export type UpdateChatStore = (state: Partial<ChatState>) => void

interface ChatStoreActions {
  updateChatStore: UpdateChatStore
}

type ChatStore = ChatState & ChatStoreActions

const initialState: ChatState = {
  isLoading: true,
  error: null,
  data: [],
}

export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,
  updateChatStore: (state: Partial<ChatState>) => {
    set(state, false)
  },
}))
