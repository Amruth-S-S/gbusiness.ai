import { useEffect } from "react"
import { get } from "@/services/utils"
import {
  UpdateForecastStore,
  getInitialState,
  useForecastStore,
} from "@/store/forecast"

export type SelectedForecastInfo = {
  type?: "add" | "edit" | "delete" | null
  forecastText?: string
  forecastId?: number
}

type UseForecast = (boardId?: number | null) => void

export const fetchForecastData = async (
  updateForecastStore: UpdateForecastStore,
  boardId: number,
) => {
  get(
    `/main-boards/boards/forecast-response/forecast-response-board-id-consultant/${boardId}`,
  )
    .then((res) => {
      const data = res && res.data

      updateForecastStore({
        data,
        isLoading: false,
        error: null,
        selectedForecastInfo: null,
      })
    })
    .catch((err) => {
      const errRes = err?.response?.data || "Something went wrong"
      updateForecastStore({
        data: [],
        isLoading: false,
        error: errRes,
        selectedForecastInfo: null,
      })
    })
}

export const useForecast: UseForecast = (boardId) => {
  const { updateForecastStore } = useForecastStore()

  useEffect(() => {
    if (boardId) {
      updateForecastStore(getInitialState())
      fetchForecastData(updateForecastStore, boardId)
    }
  }, [boardId])
}
