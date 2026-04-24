import { create } from "zustand"
import { SelectedForecastInfo } from "@/hooks/use-forecast"
import { Forecast, ForecastResponse } from "@/lib/types"

interface ForecastState {
  isLoading: boolean
  data: Forecast[]
  error: string | null
  selectedForecastInfo: SelectedForecastInfo | null
  forecastResponse: ForecastResponse | null
}

export type UpdateForecastStore = (state: Partial<ForecastState>) => void

interface ForecastStoreActions {
  updateForecastStore: UpdateForecastStore
}

type ForecastStore = ForecastState & ForecastStoreActions

export const getInitialState = (): ForecastState => ({
  isLoading: true,
  data: [],
  error: null,
  selectedForecastInfo: null,
  forecastResponse: null,
})

export const useForecastStore = create<ForecastStore>((set) => ({
  ...getInitialState(),
  updateForecastStore: (state: Partial<ForecastState>) => {
    set(state, false)
  },
}))
