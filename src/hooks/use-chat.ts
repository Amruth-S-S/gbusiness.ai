import { useEffect } from "react"
import axios from "axios"
import { digitalOceanBaseUrl } from "@/lib/constants"
import { UpdateChatStore, useChatStore } from "@/store/chat"

type UseChat = (boardId: number | null) => void

export const fetchChatData = (
  updateChatStore: UpdateChatStore,
  boardId: number,
) => {
  axios
    .get(`${digitalOceanBaseUrl}/chat/history?collection_id=${boardId}`)
    .then((res) => {
      const response = res.data
      if (response) {
        updateChatStore({
          data: response,
          isLoading: false,
          error: null,
        })
      }
    })
    .catch((err) => {
      updateChatStore({
        data: [],
        isLoading: false,
        error: err,
      })
    })
}

export const getInitialChatState = () => ({
  isLoading: true,
  data: [],
  error: null,
})

export const useChat: UseChat = (boardId) => {
  const { updateChatStore } = useChatStore()

  useEffect(() => {
    if (boardId) {
      fetchChatData(updateChatStore, boardId)
    }
  }, [boardId])
}
